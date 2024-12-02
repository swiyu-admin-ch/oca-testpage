export default class Colors {
    // Only works for complete hex colors starting with a '#'
    static isDarkColor(hexColor: string) {
        const result: RegExpExecArray | null = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexColor)

        if(!result) return false;
        if(result.length < 4) return false;

        const r = parseInt(result[1], 16)
        const g = parseInt(result[2], 16)
        const b = parseInt(result[3], 16)
        const yiq = Math.round(((r * 299) + (g * 587) + (b * 114))/1000)

        return yiq <= 125;
    }
}