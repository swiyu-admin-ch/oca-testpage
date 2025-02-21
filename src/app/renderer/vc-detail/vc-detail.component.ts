import { Component, Input } from '@angular/core';
import { OCAService, Overlays } from '../../services/oca/oca.service';
import JsonPath from '../../utils/JsonPath';

@Component({
  selector: 'app-vc-detail',
  standalone: true,
  imports: [],
  templateUrl: './vc-detail.component.html',
  styleUrl: './vc-detail.component.css'
})
export class VcDetailComponent {
  @Input({ required: true }) input!: string;
  @Input({ required: true }) oca!: string;

  vcDisplay: Array<{ type: string; value: string }> = [];

  constructor(private ocaService: OCAService) {}

  // FIXME: Error handling
  ngOnInit() {
    const captureBase = this.ocaService.getRootCaptureBase(this.oca);
    const dataSource = this.ocaService.getOverlay(this.oca, Overlays.DATA_SOURCE);
    const labels = this.ocaService.getOverlay(this.oca, Overlays.LABEL);
    const clusterOrder = this.ocaService.getOverlay(this.oca, Overlays.CLUSTER_ORDERING);
    const standard = this.ocaService.getOverlay(this.oca, Overlays.STANDARD);

    let mappedValues: { [x: string]: any } = {};
    for (const key in captureBase.attributes) {
      const queryResult = JsonPath.query(this.input, dataSource.attribute_sources[key]);
      mappedValues[key] = queryResult.length > 0 ? queryResult[0] : '';
    }

    if (clusterOrder) {
      this.parseClusterOrder(
        this.vcDisplay,
        captureBase,
        mappedValues,
        clusterOrder,
        standard,
        labels
      );
    }
  }

  parseClusterOrder(
    vcDisplay: Array<{ type: string; value: string }>,
    captureBase: { [x: string]: any },
    values: any,
    clusterOrder: { [x: string]: any },
    standard: { [x: string]: any },
    labels: { [x: string]: any }
  ) {
    const clusterOrdered = Object.keys(clusterOrder['cluster_order']).sort(
      (a, b) => clusterOrder['cluster_order'][a] - clusterOrder['cluster_order'][b]
    );

    for (const clusterKey in clusterOrdered) {
      const clusterValue = clusterOrdered[clusterKey];
      if (clusterOrder['cluster_labels'][clusterValue]) {
        vcDisplay.push({ type: 'title', value: clusterOrder['cluster_labels'][clusterValue] });
      }
      const attributesOrdered = Object.keys(
        clusterOrder['attribute_cluster_order'][clusterValue]
      ).sort(
        (a, b) =>
          clusterOrder['attribute_cluster_order'][clusterValue][a] -
          clusterOrder['attribute_cluster_order'][clusterValue][b]
      );
      //TOOD add support for data arrays!

      if (!Array.isArray(values)) {
        values = [values];
      }
      for (let i = 0; i < values.length; i++) {
        for (const attributeKey in attributesOrdered) {
          const attributeValue = attributesOrdered[attributeKey];
          if (labels['attribute_labels'][attributeValue]) {
            vcDisplay.push({ type: 'label', value: labels['attribute_labels'][attributeValue] });
          }

          const attributeType = captureBase['attributes'][attributeValue];
          if (attributeType === 'Number') {
            vcDisplay.push({ type: 'text', value: values[i][attributeValue] });
          } else if (attributeType === 'Text') {
            if (standard && standard['attr_standards'][attributeValue] === 'urn:ietf:rfc:2397') {
              vcDisplay.push({ type: 'image', value: values[i][attributeValue] });
            } else {
              vcDisplay.push({ type: 'text', value: values[i][attributeValue] });
            }
          } else if (attributeType === 'DateTime') {
            const timestamp = Date.parse(values[i][attributeValue]);
            if (!isNaN(timestamp)) {
              const date = new Date(timestamp);
              vcDisplay.push({
                type: 'text',
                value: `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`
              });
            }
          } else if (attributeType.startsWith('refs:') || attributeType.startsWith('Array[refs:')) {
            const refDigest = attributeType.startsWith('refs:')
              ? captureBase['attributes'][attributeValue].slice(5, -1)
              : captureBase['attributes'][attributeValue].slice(11, -1);

            const refCaptureBase = this.ocaService.getCaptureBaseByDigest(this.oca, refDigest);
            const refClusterOrder = this.ocaService.getOverlayByDigest(
              this.oca,
              Overlays.CLUSTER_ORDERING,
              'en',
              refDigest
            );
            const refStandard = this.ocaService.getOverlayByDigest(
              this.oca,
              Overlays.STANDARD,
              'en',
              refDigest
            );
            const refLabels = this.ocaService.getOverlayByDigest(
              this.oca,
              Overlays.LABEL,
              'en',
              refDigest
            );
            const refMappedValue = values[i][attributeValue];

            this.parseClusterOrder(
              vcDisplay,
              refCaptureBase,
              refMappedValue,
              refClusterOrder,
              refStandard,
              refLabels
            );
          }
        }

        if (i != values.length - 1) {
          vcDisplay.push({ type: 'divider', value: '' });
        }
      }
    }
  }
}
