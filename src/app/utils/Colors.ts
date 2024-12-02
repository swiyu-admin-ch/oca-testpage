export default class Colors {

    // see https://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors
    static darken(hexColor: string, amount: number): string {
      amount = amount < 0 ? 0 : amount;

      const rgb = Colors.hexToRGB(hexColor);

      const r = Math.max(Math.min(255, rgb.r - amount), 0).toString(16);
      const g = Math.max(Math.min(255, rgb.g - amount), 0).toString(16);
      const b = Math.max(Math.min(255, rgb.b - amount), 0).toString(16);

      const rr = (r.length < 2 ? '0': '') + r;
      const gg = (g.length < 2 ? '0': '') + g;
      const bb = (b.length < 2 ? '0': '') + b;

      return `#${rr}${gg}${bb}`;
    }
    // Only works for complete hex colors starting with a '#'
    static isDarkColor(hexColor: string) {
        const rgb = Colors.hexToRGB(hexColor);
        const yiq = Math.round(((rgb.r * 299) + (rgb.g * 587) + (rgb.b * 114))/1000)

        return yiq <= 125;
    }

    private static hexToRGB(hexColor: string): any {
      const result: RegExpExecArray | null = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexColor)

        if(!result) return false;
        if(result.length < 4) return false;

        return {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        }
    }
}