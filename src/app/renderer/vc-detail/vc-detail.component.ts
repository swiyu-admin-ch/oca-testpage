import { Component, Input } from '@angular/core';
import { OCAService } from '../../services/oca/oca.service';
import JsonPath from '../../utils/JsonPath';
import {
  CaptureBase,
  ClusterOrderingOverlay,
  LabelOverlay,
  OverlayTypes,
  StandardOverlay,
  JsonObject,
  OCABundle
} from '../../model';
import { getOverlayByDigest, getRootCaptureBase } from '../../utils/OCA';
import { ErrorComponent } from '../error/error.component';

@Component({
  selector: 'app-vc-detail',
  standalone: true,
  imports: [ErrorComponent],
  templateUrl: './vc-detail.component.html',
  styleUrl: './vc-detail.component.css'
})
export class VcDetailComponent {
  @Input({ required: true }) input!: JsonObject;
  @Input({ required: true }) oca!: OCABundle;
  @Input({ required: true }) language!: string;

  vcDisplay: Array<{ type: string; value: string }> = [];
  error: Error | undefined;

  constructor(private ocaService: OCAService) {}

  ngOnInit() {
    try {
      this.error = undefined;
      this.update();
    } catch (e) {
      this.error = e as Error;
    }
  }

  private update() {
    const captureBase = getRootCaptureBase(this.oca);
    const dataSource = this.ocaService.getOverlay(this.oca, OverlayTypes.DATA_SOURCE);
    if (!dataSource) {
      throw new Error('No dataSource overlay found');
    }

    const clusterOrder = this.ocaService.getOverlay(
      this.oca,
      OverlayTypes.CLUSTER_ORDERING,
      this.language
    );
    if (!clusterOrder) {
      throw new Error(`No clusterOrder overlay for language ${this.language} found`);
    }

    const labels = this.ocaService.getOverlay(this.oca, OverlayTypes.LABEL, this.language);
    const standard = this.ocaService.getOverlay(this.oca, OverlayTypes.STANDARD);

    const mappedValues = Object.keys(captureBase.attributes).reduce<Record<string, any>>(
      (aggr, key) => {
        const queryResult = JsonPath.query(this.input, dataSource.attribute_sources[key]);
        return {
          ...aggr,
          [key]: queryResult.length ? queryResult[0] : ''
        };
      },
      {}
    );

    this.vcDisplay = this.parseClusterOrder(
      captureBase,
      mappedValues,
      clusterOrder,
      standard,
      labels
    );
  }

  private parseClusterOrder(
    captureBase: CaptureBase,
    values: any,
    clusterOrder: ClusterOrderingOverlay,
    standard: StandardOverlay | undefined,
    labels: LabelOverlay | undefined
  ): Array<{ type: string; value: string }> {
    const clusterOrdered = Object.keys(clusterOrder.cluster_order).sort(
      (a, b) => clusterOrder.cluster_order[a] - clusterOrder.cluster_order[b]
    );

    const result = [];

    for (const clusterKey in clusterOrdered) {
      const clusterValue = clusterOrdered[clusterKey];
      if (clusterOrder.cluster_labels?.[clusterValue]) {
        result.push({ type: 'title', value: clusterOrder.cluster_labels[clusterValue] });
      }
      const attributesOrdered = Object.keys(
        clusterOrder.attribute_cluster_order[clusterValue]
      ).sort(
        (a, b) =>
          clusterOrder.attribute_cluster_order[clusterValue][a] -
          clusterOrder.attribute_cluster_order[clusterValue][b]
      );
      //TOOD add support for data arrays!

      if (!Array.isArray(values)) {
        values = [values];
      }
      for (let i = 0; i < values.length; i++) {
        for (const attributeKey in attributesOrdered) {
          const attributeValue = attributesOrdered[attributeKey];
          if (labels?.attribute_labels[attributeValue]) {
            result.push({ type: 'label', value: labels.attribute_labels[attributeValue] });
          }

          const attributeType = captureBase.attributes[attributeValue];
          if (attributeType === 'Numeric') {
            result.push({ type: 'text', value: values[i][attributeValue] });
          } else if (attributeType === 'Text') {
            if (standard && standard.attr_standards[attributeValue] === 'urn:ietf:rfc:2397') {
              result.push({ type: 'image', value: values[i][attributeValue] });
            } else {
              result.push({ type: 'text', value: values[i][attributeValue] });
            }
          } else if (attributeType === 'DateTime') {
            const timestamp = Date.parse(values[i][attributeValue]);
            if (!isNaN(timestamp)) {
              const date = new Date(timestamp);
              result.push({
                type: 'text',
                value: `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`
              });
            }
          } else if (
            attributeType?.startsWith('refs:') ||
            attributeType?.startsWith('Array[refs:')
          ) {
            const refDigest = attributeType.startsWith('refs:')
              ? attributeType.slice(5, -1)
              : attributeType.slice(11, -1);

            const refCaptureBase = this.ocaService.getCaptureBaseByDigest(this.oca, refDigest);
            const refClusterOrder = getOverlayByDigest(
              this.oca,
              OverlayTypes.CLUSTER_ORDERING,
              refDigest,
              this.language
            );
            const refStandard = getOverlayByDigest(this.oca, OverlayTypes.STANDARD, refDigest);
            const refLabels = getOverlayByDigest(
              this.oca,
              OverlayTypes.LABEL,
              refDigest,
              this.language
            );
            const refMappedValue = values[i][attributeValue];

            if (refClusterOrder) {
              result.push(
                ...this.parseClusterOrder(
                  refCaptureBase,
                  refMappedValue,
                  refClusterOrder,
                  refStandard,
                  refLabels
                )
              );
            }
          }
        }

        if (i != values.length - 1) {
          result.push({ type: 'divider', value: '' });
        }
      }
    }

    return result;
  }
}
