import { Component, Input } from '@angular/core';
import { OCAService, Overlays } from '../../services/oca/oca.service';
import JsonPath from '../../utils/JsonPath';
import Colors from '../../utils/Colors';

@Component({
  selector: 'app-vc-detail',
  standalone: true,
  imports: [],
  templateUrl: './vc-detail.component.html',
  styleUrl: './vc-detail.component.css'
})
export class VcDetailComponent {
  @Input({required: true}) input!: string;
  @Input({required: true}) oca!: string;

  vcName = "";
  vcSubtitle = "";
  vcLogo = "";
  vcPrimaryBackground = "";
  vcFontColor = "";
  vcDisplay: Array<{type:string, value:string}> = [];

  constructor(private ocaService: OCAService) {}

  // FIXME: Error handling
  ngOnInit() {
    const captureBase = this.ocaService.getRootCaptureBase(this.oca);
    const meta = this.ocaService.getOverlay(this.oca, Overlays.META, "en");
    const branding = this.ocaService.getOverlay(this.oca, Overlays.BRANDING, "en");
    const dataSource = this.ocaService.getOverlay(this.oca, Overlays.DATA_SOURCE);
    const labels = this.ocaService.getOverlay(this.oca, Overlays.LABEL);
    const clusterOrdering = this.ocaService.getOverlay(this.oca, Overlays.CLUSTER_ORDERING)

    let mappedValues: {[x: string]: any;} = {};
    for(const key in captureBase.attributes) {
      const queryResult = JsonPath.query(this.input, dataSource.attribute_sources[key])
      mappedValues[key] = queryResult.length > 0 ? queryResult[0] : '';
    }

    if(meta) {
      this.vcName = meta.name;
    }
    if(branding) {
      this.vcLogo = branding.logo;
      this.vcPrimaryBackground = branding.primary_background;
      this.vcFontColor = Colors.isDarkColor(branding.primary_background) ? "#FFFFFF" : "#000000";
      this.vcSubtitle = branding.primary_field.replace(/\{\{(.*?)\}\}/g, (_: any, p1: string) => mappedValues.hasOwnProperty(p1) ? mappedValues[p1]: '');
    }
    if(clusterOrdering) {
      const clusterOrdered = Object.keys(clusterOrdering["cluster_order"]).sort((a,b) => clusterOrdering["cluster_order"][a] - clusterOrdering["cluster_order"][b]);
      
      for(const clusterKey in clusterOrdered) {
        const clusterValue = clusterOrdered[clusterKey];
        this.vcDisplay.push({type: "title", value: clusterOrdering["cluster_labels"][clusterValue]});
        const attributesOrdered = Object.keys(clusterOrdering["attribute_cluster_order"][clusterValue]).sort((a,b) => clusterOrdering["attribute_cluster_order"][clusterValue][a] - clusterOrdering["attribute_cluster_order"][clusterValue][b])
        for(const attributeKey in attributesOrdered) {
          const attributeValue = attributesOrdered[attributeKey];
          switch(captureBase["attributes"][attributeValue]) {
            case "Text":
              this.vcDisplay.push({type: "label", value: labels["attribute_labels"][attributeValue]});
              this.vcDisplay.push({type: "text", value: mappedValues[attributeValue]});
              //FIXME missing Data URL use case
              break;
            case "DateTime":
            case "refs:":
            case "Array[refs:":
              //FIXME Missing implementation
              break;
          }
        }
      }
    }
  }
}
