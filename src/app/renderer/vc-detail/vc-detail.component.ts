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

  vcDisplay: Array<{type:string, value:string}> = [];

  constructor(private ocaService: OCAService) {}

  // FIXME: Error handling
  ngOnInit() {
    const captureBase = this.ocaService.getRootCaptureBase(this.oca);
    const dataSource = this.ocaService.getOverlay(this.oca, Overlays.DATA_SOURCE);
    const labels = this.ocaService.getOverlay(this.oca, Overlays.LABEL);
    const clusterOrdering = this.ocaService.getOverlay(this.oca, Overlays.CLUSTER_ORDERING);
    const standard = this.ocaService.getOverlay(this.oca, Overlays.STANDARD);

    let mappedValues: {[x: string]: any;} = {};
    for(const key in captureBase.attributes) {
      const queryResult = JsonPath.query(this.input, dataSource.attribute_sources[key])
      mappedValues[key] = queryResult.length > 0 ? queryResult[0] : '';
    }

    if(clusterOrdering) {
      const clusterOrdered = Object.keys(clusterOrdering["cluster_order"]).sort((a,b) => clusterOrdering["cluster_order"][a] - clusterOrdering["cluster_order"][b]);
      
      for(const clusterKey in clusterOrdered) {
        const clusterValue = clusterOrdered[clusterKey];
        this.vcDisplay.push({type: "title", value: clusterOrdering["cluster_labels"][clusterValue]});
        const attributesOrdered = Object.keys(clusterOrdering["attribute_cluster_order"][clusterValue]).sort((a,b) => clusterOrdering["attribute_cluster_order"][clusterValue][a] - clusterOrdering["attribute_cluster_order"][clusterValue][b])
        for(const attributeKey in attributesOrdered) {
          const attributeValue = attributesOrdered[attributeKey];
          this.vcDisplay.push({type: "label", value: labels["attribute_labels"][attributeValue]});
          switch(captureBase["attributes"][attributeValue]) {
            case "Text":
              if(standard && standard["attr_standards"][attributeValue] === "urn:ietf:rfc:2397") {
                this.vcDisplay.push({type: "image", value: mappedValues[attributeValue]});
              } else {
                this.vcDisplay.push({type: "text", value: mappedValues[attributeValue]});
              }
              break;
            case "DateTime":
              const timestamp = Date.parse(mappedValues[attributeValue]);
              if(!isNaN(timestamp)) {
                const date = new Date(timestamp);
                this.vcDisplay.push({type: "text", value: `${date.getDate()}.${date.getMonth()+1}.${date.getFullYear()}`});
              }
              break;

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
