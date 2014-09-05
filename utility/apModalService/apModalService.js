'use strict';

/**
 * @ngdoc service
 * @name angularPoint.apModalService
 * @description
 * Extends a modal form to include many standard functions
 *
 */
angular.module('angularPoint')
    .service('apModalService', function ($modal, apModelFactory, _, toastr) {


        /**
         * @ngdoc function
         * @name angularPoint.apModalService:modalModelProvider
         * @methodOf angularPoint.apModalService
         * @description
         * Extends a model to allow us to easily attach a modal form that accepts and injects a
         * dynamic number of arguments.
         * @param {object} options Configuration object.
         * @param {string} options.templateUrl Reference to the modal view.
         * @param {string} options.controller Name of the modal controller.
         * @param {string[]} [options.expectedArguments] First argument name should be the item being edited.
         * @returns {object} Function which returns openModal that in turn returns a promise.
         *
         * @example
         * <pre>
         *    model.openModal = apModalService.modalModelProvider({
         *        templateUrl: 'modules/comp_request/views/comp_request_modal_view.html',
         *        controller: 'compRequestModalCtrl',
         *        expectedArguments: ['request']
         *    });
         * </pre>
         */
        function modalModelProvider(options) {
            return function openModal() {
                var self = openModal;
                var defaults = {
                    templateUrl: options.templateUrl,
                    controller: options.controller,
                    resolve: {}
                };
                var modalConfig = _.extend({}, defaults, options);

                /** Store a reference to any arguments that were passed in */
                var args = arguments;

                /**
                 * Create members to be resolved and passed to the controller as locals;
                 *  Equivalent of the resolve property for AngularJS routes
                 */
                _.each(options.expectedArguments, function (argumentName, index) {
                    modalConfig.resolve[argumentName] = function () {
                        return args[index];
                    };
                });

                var modalInstance = $modal.open(modalConfig);

                /** Assume that if there is a first argument, it is the item we're editing */
                if (args[0]) {
                    /** Create a copy in case we need to revert back */
                    self.snapshot = angular.copy(args[0]);
                    modalInstance.result.then(function () {

                    }, function () {
                        /** Undo any changes if cancelled */
                        _.extend(args[0], self.snapshot);
                    });
                }

                return modalInstance.result;
            };
        }

        /**
         * @ngdoc function
         * @name angularPoint.apModalService:getPermissions
         * @methodOf angularPoint.apModalService
         * @description
         * Returns an object containing the permission levels for the current user
         * @param {object} entity JavaScript object representing the SharePoint list item.
         * @param {object} [model] Fallback so we can use the model to determine the user's
         * list permissions instead of the list item.
         * @returns {object} {userCanEdit: boolean, userCanDelete: boolean, userCanApprove: boolean, fullControl: boolean}
         */
        function getPermissions(entity, model) {
            var userPermissions = {
                /** Assume that if no item is passed in, the user can create one */
                userCanApprove: false,
                userCanDelete: false,
                userCanEdit: false,
                fullControl: false
            };

            function resolvePermissions(permObj) {
                var userPermMask = permObj.resolvePermissions();
                userPermissions.userCanEdit = userPermMask.EditListItems;
                userPermissions.userCanDelete = userPermMask.DeleteListItems;
                userPermissions.userCanApprove = userPermMask.ApproveItems;
                userPermissions.fullControl = userPermMask.FullMask;
            }

            if (entity && entity.resolvePermissions) {
                resolvePermissions(entity);
            } else if (model && model.resolvePermissions) {
                /** Fallback to retrieve permissions from the model when a list item isn't available */
                resolvePermissions(model);
            }

            return userPermissions;
        }

        /**
         * @ngdoc function
         * @name angularPoint.apModalService:initializeState
         * @methodOf angularPoint.apModalService
         * @description
         * Creates a state object, populates permissions for current user, and sets display mode
         *
         * @param {object} entity JavaScript object representing the SharePoint list item.
         * @param {object} [options] Optional state params.
         * @param {object} [model] Optional fallback to list permissions instead of using
         * list item permissions.
         * @returns {object} Returns the extended state.
         *
         * @example
         * <pre>
         * $scope.state = apModalService.initializeState(request, {
         *     dateExceedsBoundary: false,
         *     enableApproval: false
         * });
         * </pre>
         * <pre>
         * //Returns
         * $scope.state = {
         *    // Default "View" and once permissions are checked it
         *    // can also be "New" || "Edit"
         *    displayMode: "New",
         *    // Below 2 options allow for locking with 3 way
         *    // binding service like FireBase
         *    locked: false,
         *    lockedBy: '',
         *    // Flag which can be used to disable form controls
         *    negotiatingWithServer: false,
         *    userCanApprove: false,
         *    userCanDelete: false,
         *    userCanEdit: false,
         *    //User has admin rights
         *    fullControl: false
         * }
         * </pre>
         */
        function initializeState(entity, options, model) {
            var state = {
                displayMode: 'View', // New || Edit || View
                locked: false,
                lockedBy: '',
                negotiatingWithServer: false,
                ready: false
            };

            var permissions = getPermissions(entity, model);

            /** Check if it's a new form */
            if (!entity || !entity.id) {
                state.displayMode = 'New';
            } else if (permissions.userCanEdit) {
                state.displayMode = 'Edit';
            }

            return _.extend(state, permissions, options);
        }

        /**
         * @ngdoc function
         * @name angularPoint.apModalService:deleteEntity
         * @methodOf angularPoint.apModalService
         * @description
         * Prompts for confirmation of deletion, then deletes and closes modal
         * @param {object} entity JavaScript object representing the SharePoint list item.
         * @param {object} state Controllers state object.
         * @param {object} $modalInstance Reference to the modal instance for the modal dialog.
         * @param {object} [options] Options to pass to ListItem.deleteItem().
         * @example
         *
         * <pre>
         *   $scope.deleteRequest = function () {
     *     apModalService.deleteEntity($scope.request, $scope.state,
     *        $modalInstance, {updateAllCaches: true});
     * };
         * </pre>
         */
        function deleteEntity(entity, state, $modalInstance, options) {
            var confirmation = window.confirm('Are you sure you want to delete this record?');
            if (confirmation) {
                /** Disable form buttons */
                state.negotiatingWithServer = true;
                entity.deleteItem(options).then(function () {
                    toastr.success('Record deleted successfully');
                    $modalInstance.close();
                }, function () {
                    toastr.error('Failed to delete record.  Please try again.');
                });
            }
        }

        /**
         * @ngdoc function
         * @name angularPoint.apModalService:saveEntity
         * @methodOf angularPoint.apModalService
         * @description
         * Creates a new record if necessary, otherwise updates the existing record
         * @param {object} entity List item.
         * @param {object} model Reference to the model for the list item.
         * @param {object} state Deprecated....
         * @param {object} $modalInstance Reference to the modal instance for the modal dialog.
         * @param {object} [options] Options to pass to ListItem.saveChanges().
         * @example
         * <pre>
         *  $scope.saveRequest = function () {
     *      apModalService.saveEntity($scope.request, compRequestsModel,
     *          $scope.state, $modalInstance, {updateAllCaches: true});
     *  };
         *  </pre>
         */
        function saveEntity(entity, model, state, $modalInstance, options) {
            if (entity.id) {
                entity.saveChanges(options)
                    .then(function () {
                        toastr.success('Record updated');
                        $modalInstance.close();
                    }, function () {
                        toastr.error('There was a problem updating this record.  Please try again.');
                    });
            } else {
                /** Create new record */
                model.addNewItem(entity, options)
                    .then(function () {
                        toastr.success('New record created');
                        $modalInstance.close();
                    }, function () {
                        toastr.error('There was a problem creating a new record.  Please try again.');
                    });
            }
        }

        /**
         * @ngdoc function
         * @name Model.initializeModalState
         * @module Model
         * @description
         * Uses apModalService to return some general state information for a modal form using
         * the current user's permissions if an entity is passed in.  Otherwise we attempt to
         * return the user's permissions for the list.  We also include some additional flags
         * and with the use of the options param extend any other custom attributes on the returned
         * state object.
         *
         * @param {object} [entity] SharePoint list item.
         * @param {object} [options] Object containing optional attributes that will be used
         * to extend the returned state object.
         * @returns {object} State object with flags.
         *
         * @example
         * <pre>
         * <file name="app/modules/project/project_modal_ctrl.js">
         * //Controller
         * 'use strict';
         * angular.module('App')
         *  .controller('projectModalCtrl', function (
         *                                              $scope,
         *                                              $modalInstance,
         *                                              projectsModel,
         *                                              apModalService,
         *                                              project
         *                                            ) {
        *
        *      $scope.state = projectsModel.initializeModalState(project, {
        *           stateOption1: false,
        *           stateOption2: true
        *      });
        *
        *      $scope.cancel = function () {
        *           $modalInstance.dismiss('cancel');
        *      };
        *
        *      $scope.project = project;
        *
        *      $scope.saveRequest = function () {
        *           apModalService.saveEntity(
        *              $scope.request,
        *              projectsModel,
        *              $scope.state,
        *              $modalInstance );
        *      };
        * });
         * </file>

         * <file name="app/modules/project/project_modal_view.html">
         * //VIEW
         * <div ng-form>
         *     <div class="modal-header">
         *         <button type="button" class="close"
         *                ng-click="cancel()" aria-hidden="true">&times;</button>
         *         <h4>Project Details</h4>
         *     </div>
         *     <div class="modal-body">
         *         <div class="well">
         *             <div ng-form>
         *                 <div class="form-group">
         *                     <label>Title</label>
         *                     <input type="text"
         *                        class="form-control" ng-model="project.title"/>
         *                 </div>
         *                 <div class="form-group">
         *                     <label>Description</label>
         *                     <textarea rows="6" cols="50" class="form-control"
         *                               ng-model="project.description"></textarea>
         *                 </div>
         *             </div>
         *         </div>
         *     </div>
         *     <div class="modal-footer">
         *         <div class="pull-left">
         *             <button class="btn btn-danger"
         *                    ng-click="deleteRecord()"
         *                   ng-show="project.id && state.canDelete"
         *                   ng-disabled="state.negotiatingWithServer"
         *                   title="Delete this task request">
         *                 <i class="fa fa-trash-o"></i>
         *             </button>
         *         </div>
         *         <button class="btn btn-primary"
         *            ng-click="save()"
         *            ng-disabled="project.title.length === 0 ||
         *                state.negotiatingWithServer">OK</button>
         *         <button class="btn btn-default"
         *            ng-click="cancel()">Cancel</button>
         *     </div>
         * </div>
         * </file>
         * </pre>
         *
         * <pre>
         * //Returns
         * $scope.state = {
        *    // Default "View" and once permissions are checked it
        *    // can also be "New" || "Edit"
        *    displayMode: "New",
        *    // Below 2 options allow for locking with 3 way
        *    // binding service like FireBase
        *    locked: false,
        *    lockedBy: '',
        *    // Flag which can be used to disable form controls
        *    negotiatingWithServer: false,
        *    userCanApprove: false,
        *    userCanDelete: false,
        *    userCanEdit: false,
        *    //User has admin rights
        *    fullControl: false,
        *    //Custom attributes passed in the options param
        *    stateOption1: false,
        *    stateOption2: true
        * }
         * </pre>
         */
        function initializeModalState(entity, options) {
            return initializeState(entity, options, this);
        }

        /** Extend the Model prototype */
        apModelFactory.Model.prototype.initializeModalState = initializeModalState;


        return {
            deleteEntity: deleteEntity,
            initializeState: initializeState,
            modalModelProvider: modalModelProvider,
            getPermissions: getPermissions,
            saveEntity: saveEntity
        };

    });
