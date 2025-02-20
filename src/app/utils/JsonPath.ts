/* Simple JsonPath implementation
* only support:
* - '$' root element
* 
* FIXME: support for arrays
*/
export default class JsonPath {
    static query(input: string, query: string)  {
        const resultArray: any[] = [];

        if(!query.startsWith("$")) return resultArray;

        const path = query.substring(1).split(".");

        let data = JSON.parse(input);
        for(let i = 1; i < path.length; i++) {
            if(data.hasOwnProperty(path[i])) {
                data = data[path[i]];
            } else {
                return resultArray;
            }
        }

        resultArray.push(data);

        return resultArray;
    }
}