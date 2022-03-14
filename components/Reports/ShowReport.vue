<template>
  <v-dialog v-model="dialog">
    <v-card>
      <v-card-title class="pa-0">
        <v-toolbar dense dark >
          <v-row justify="center" align="center">
            <v-btn dark color="accent" @click="close">
              Đóng
              <v-icon right dark>close</v-icon>
            </v-btn>
          </v-row>
        </v-toolbar>
      </v-card-title>
      <v-card-text>
        <div id="viewerContent"></div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    reportData: null,
    printToPrinter: false,
    dialog: {
      default: false
    }
  },
  data() {
    return {};
  },
  async updated() {
    if (process.client) {
      this.dangKy();

      this.$store.commit("SET_LOADING", true);

      if (this.reportData && this.reportData.report_path) {
        if (this.dialog) {

          let reportDataSet = new Stimulsoft.System.Data.DataSet();
          reportDataSet.readJson(JSON.stringify(this.reportData.data));

          let report = Stimulsoft.Report.StiReport.createNewReport();
          let reportData = await this.$axios.get(this.reportData.report_path, {
            responseType: "blob",
            headers: {'Cache-Control': 'no-cache'},
            pragma: "no-cache",
            expires: 0,
          });

          const fileURL = window.URL.createObjectURL(new Blob([reportData.data]));


          await report.loadFile(fileURL);


          report.dictionary.databases.clear();
          report.regData("Data", null, reportDataSet);

          // Print report using web browser
          if (this.printToPrinter) {
            this.$emit("update:dialog", false);
            report.renderAsync(function () {
              report.print();
            });
            return;
          }

          const options = new Stimulsoft.Viewer.StiViewerOptions();
          options.toolbar.viewMode = Stimulsoft.Viewer.StiWebViewMode.Continuous;



          const viewer = new Stimulsoft.Viewer.StiViewer(
            options,
            "StiViewer",
            false
          );


          viewer.report = report;
          viewer.renderHtml("viewerContent");

          let userButton = viewer.jsObject.SmallButton("userButton", "Đóng báo cáo", "emptyImage");
          userButton.image.src = "/close.png";
          userButton.action = function (e) {
            this.jsObject.controls.reportPanel.clear();
            this.jsObject.reportParams.pageNumber = 0;
            this.jsObject.reportParams.pagesCount = 0;
            this.jsObject.controls.toolbar.changeToolBarState();

            //if you want close viewer, use this code
            this.jsObject.controls.viewer.parentNode.removeChild(this.jsObject.controls.viewer);

          }

          let toolbarTable = viewer.jsObject.controls.toolbar.firstChild.firstChild;
          let buttonsTable = toolbarTable.rows[0].firstChild.firstChild;
          let userButtonCell = buttonsTable.rows[0].insertCell(0);
          userButtonCell.className = "stiJsViewerClearAllStyles";
          userButtonCell.appendChild(userButton);

        }
      }

      this.$store.commit("SET_LOADING", false);
    }
  },
  mounted() {
  },
  created: function () {

  },
  methods: {
    SaveData() {
    },
    dangKy() {
      Stimulsoft.Base.StiLicense.key = "6vJhGtLLLz2GNviWmUTrhSqnOItdDwjBylQzQcAOiHkcgIvwL0jnpsDqRpWg5FI5kt2G7A0tYIcUygBh1sPs7plofUOqPB1a4HBIXJB621mau2oiAIj+ysU7gKUXfjn/D5BocmduNB+ZMiDGPxFrAp3PoD0nYNkkWh8r7gBZ1v/JZSXGE3bQDrCQCNSy6mgby+iFAMV8/PuZ1z77U+Xz3fkpbm6MYQXYp3cQooLGLUti7k1TFWrnawT0iEEDJ2iRcU9wLqn2g9UiWesEZtKwI/UmEI2T7nv5NbgV+CHguu6QU4WWzFpIgW+3LUnKCT/vCDY+ymzgycw9A9+HFSzARiPzgOaAuQYrFDpzhXV+ZeX31AxWlnzjDWqpfluygSNPtGul5gyNt2CEoJD1Yom0VN9fvRonYsMsimkFFx2AwyVpPcs+JfVBtpPbTcZscnzUdmiIvxv8Gcin6sNSibM6in/uUKFt3bVgW/XeMYa7MLGF53kvBSwi78poUDigA2n12SmghLR0AHxyEDIgZGOTbNI33GWu7ZsPBeUdGu55R8w=";
    }
    ,
    close() {
      this.$emit("update:dialog", false);
    }
  }
}
;
</script>

<style></style>
