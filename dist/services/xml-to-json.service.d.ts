export interface IParseOptions {
    includeAllAttrs?: boolean;
    mapping?: Object;
    removeOws?: boolean;
    sparse?: boolean;
}
declare let xmlToJSONService: {
    parse(xmlNodeSet: NodeListOf<Element>, {includeAllAttrs = true, mapping = {}, removeOws = true, sparse = false}?: IParseOptions): Object[];
};
export { xmlToJSONService };
