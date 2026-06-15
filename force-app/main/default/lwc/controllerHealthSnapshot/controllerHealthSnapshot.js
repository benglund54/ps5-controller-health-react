import { LightningElement, api, wire } from "lwc";
import getControllerHealthSummary from "@salesforce/apex/ControllerHealthSnapshotController.getControllerHealthSummary";

export default class ControllerHealthSnapshot extends LightningElement {
  @api recordId;

  summary;
  errorMessage;

  @wire(getControllerHealthSummary, { contactId: "$recordId" })
  wiredSummary({ data, error }) {
    if (data) {
      this.summary = data;
      this.errorMessage = undefined;
      return;
    }
    if (error) {
      this.summary = undefined;
      this.errorMessage = "Controller health summary is temporarily unavailable.";
    }
  }

  get hasSummary() {
    return !!this.summary;
  }

  get hasRecentCases() {
    return (
      this.summary &&
      Array.isArray(this.summary.recentCaseNumbers) &&
      this.summary.recentCaseNumbers.length > 0
    );
  }
}
