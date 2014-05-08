angular.module('angularPoint')
    .directive('apComments', function ($sce, $timeout, commentsModel, apConfig, toastr) {
        return {
            restrict: "A",
            replace: true,
            templateUrl: 'src/directives/ap_comments/ap_comments_tmpl.html',
            scope: {
                listItem: "=",      //List item the attachments belong to
                changeEvent: '='    //Optional - called after an attachment is deleted
            },
            link: function (scope, element, attrs) {

                scope.state = {
                    ready: false,
                    tempComment: '',
                    tempResponse: '',
                    respondingTo: ''
                };

                scope.comments = scope.listItem.comments || null;

                //Helper to force digest
                scope.refresh = function () {
                    if (!scope.$$phase) {
                        scope.$apply();
                    }
                };

                scope.clearTempVars = function () {
                    $timeout(function() {
                        scope.state.respondingTo = '';
                        scope.state.tempResponse = '';
                        scope.state.tempComment = '';
                    });
                };

                scope.createNewComment = function () {
                    toastr.info("Negotiating with the server");

                    if (scope.comments) {
                        //Comment already exists so no need to create new one
                        scope.comments.createResponse(scope.state.tempComment).then(function (response) {
                            scope.comments = response;
                            scope.clearTempVars();
                        });
                    } else {
                        //Creating a new list item
                        commentsModel.createComment(scope.listItem, scope.state.tempComment).then(function (response) {
                            scope.comments = response;
                            scope.clearTempVars();
                        });
                    }
                };

                scope.createResponse = function (comment) {
                    toastr.info("Negotiating with the server");
                    comment.createResponse(scope.state.tempResponse).then(function () {
                        scope.clearTempVars();
                    });
                };

                scope.deleteComment = function (comment) {
                    var parent = comment.parentComment();
                    var root = comment.rootComment();

                    var confirmation = window.confirm("Are you sure you want to delete this comment?");
                    if (confirmation) {
                        toastr.info("Negotiating with the server");
                        if (parent === root && parent.thread.length === 1) {
                            //Delete the list item because it's at the root and there are no others
                            return root.deleteItem().then(function () {
                                //Remove reference to the comment
                                delete scope.comments;
                                delete scope.listItem.comments;
                                toastr.success("Comment successfully deleted");
                            }, function () {
                                toastr.error("There was a problem deleting this comment.  Please try again.");
                            });
                        } else {
                            return root.saveChanges().then(function () {
                                //Just remove this comment from the thread
                                var commentIndex = parent.thread.indexOf(comment);
                                parent.thread.splice(commentIndex, 1);
                                toastr.success("Comment successfully deleted");
                            }, function () {
                                toastr.error("There was a problem deleting this comment.  Please try again.");
                            });
                        }
                    }
                };

                //Pull down all comments for the current list item
                var fetchComments = function () {
                    toastr.info("Checking for new comments");
                    scope.listItem.fetchComments().then(function (comments) {
                        $timeout(function () {
                            if (apConfig.offline && !scope.listItem.comments) {
                                //Just return first comment
                                scope.comments = comments[0];
                            } else if (comments.length > 0) {
                                scope.comments = comments[0];
                            }

                            //Store updated comments on list item
                            scope.listItem.comments = scope.comments;

                            scope.state.ready = true;
                        });
                    });
                };

                fetchComments();

                commentsModel.sync.subscribeToChanges(function () {
                    //Ensure all updates to comment thread are displayed as they happen
//                    var localComments = commentsModel.checkForLocalComments(scope.listItem);
//                    if(localComments) {
//                        scope.comments = localComments;
//                        scope.listItem.comments = localComments;
//                    }
                    console.log("Comment change detected");
                });

            }
        };
    });