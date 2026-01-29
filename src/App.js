import './App.css';
import {useEffect, useRef} from "react";
import ComPDFKitViewer from '@compdfkit_pdf_sdk/webviewer';


function App() {
  const containerRef = useRef(null);

  useEffect(() => {
    let docViewer = null;
    ComPDFKitViewer.init(
        {
          path: "/",
          pdfUrl: "/example/form_filling.pdf",
          css: "/webviewer.css",
          license: "7i5n6pD/R+o39065lYYrl7iovS2CnI0H2UKJ/w0iyM7O7klvn+sORYAYgPUMo88nnlTZOnYzWxT5GmzvgBTUva9DrmWT5i2E5TKf2renFhBQOLd86vWhrt3obuO8917JI79NJNkYuX+6Q4z1HA4/7NncxPy7wijY6hOAZsys5Td0AbHd28YbqrODNMs7cXIEV0cOtl6vWkFQvDekfFR4ctyN8Aag3brglLc2B8v04dscUT0z1yxOp6iSLOGH75UPWdWsnQnHTt65NhO1KbXGDsKDNBCmy8iCNDNTX8/3nbR8+NAUQo7CEWrj/8jwXKFxhQQXFZBo7muvvYbW8YNZX6H7s5xY/Iv/L6h8UJr1o3p+wxFWehTtyGw6CXxbvt2ZcJPcHhMjahzqt/pvJaGewkumriAxtMPNuxn0Cvn9lNOn9tDXxx4B1sQbOADPPlAS3s0s5QWAtHG1mxjUCJaZyLZ4PNADAi6dhZ4eEJfV6TsZnqnnMSU2N+cKOA7Ed4Q4Zlbpao8LuvtJBmfTrHMBJszT8HB92qLwarLi0hBbbFH6BYaqbQ1F+ehmG27LnpyG+Ea/5Jd89t9ye5FoDdAhm8j4x9yOy/fdSALl+QtcwUnI7pJydGgPDx14+wSeK8OFjIDra8xSDQsRRZIS4JSg/lT3oLPCDbGxKLz1xsDKKjrWjURIISn2OS5xQL1IX7anuhIJndNfDgM+9Nienj3BE8jnggI4rDz/Pk99kiSqMFV0VavXDAus9AAd+knf5we5FTvPopy19rURIcjzxSof1RN4tuyCgEfbXQs9/78FmMmJ13cvkPVn5t1TEnlMmU2A/5g/zBHLnnQpfcfaBa+1B7/uXG4l+wAhtSOCLs1ighjjHytcv+YZLVWocvbzKd4VWLPaPJ9tGeNJSzPY/I0gWg==",
          disableDigitalSignature: true,
          autoJumpNextSign: true
        },
        containerRef.current
    ).then((instance) => {
      docViewer = instance.docViewer;
      const { UI, Core } = instance;
      UI.setHeaderItems(function (header) {
        let rightItems = header.getHeader("rightHeaders").getItems();
        rightItems.length = 0;
        const items = header.getHeader("tools").getItems();
        items.length = 0;
      });

      UI.setSignatureDialogTabs(["trackpad", "keyboard"]);

      UI.setSignatureDialogProperties("trackpad", {
        colors: [
          {
            type: "color",
            value: "rgb(0, 0, 0)"
          },
          {
            type: "color",
            value: "rgb(45, 119, 250)"
          }
        ],
        enableLineWidth: false,
        enableCustomColor: false
      });
      UI.setSignatureDialogProperties("keyboard", {
        colors: [
          {
            type: "color",
            value: "rgb(0, 0, 0)"
          },
          {
            type: "color",
            value: "rgb(45, 119, 250)"
          }
        ],
        fonts: ["Alex Brush", "Pacifico", "Allura", "Shadows Into Light", "Sacramento"],
        enableCustomColor: false
      });

      UI.disableSignatureTool();

      docViewer.addEvent("documentloaded", async () => {
        props.onLoad?.(docViewer);
        if (window.innerWidth > 600) {
          docViewer.webViewerScaleChanged(props.scale ? props.scale : 1.5);
        }
        const elements = document.querySelectorAll(`.color-tool`);
        elements.forEach((el) => {
          (el as HTMLElement).style.display = "none";
        });
      });
      docViewer.addEvent("signedComplete", async (data) => {
        if (data.unSignedNumber === 0) {
          const docStream = await docViewer.flattenPdf();
          const docBlob = new Blob([docStream], { type: "application/pdf" });
          props.handleSave(docBlob);
        }
      });
      docViewer.addEvent("message", (data) => {
        if (data.type === "ERROR") {
          props.stopLoader();
          props.handleError?.(data);
          props.showToast({
            title: transformPhrase("something_went_wrong", props.UiLanguage, {}),
            description: transformPhrase("compdf_error", props.UiLanguage, { msg: data.message }),
            color: "error",
            time: 10000
          });
        }
      });
      docViewer.enableFillConsecutively();

      // Get the number of unfilled textfields
      UI.disableElements([
        "rightPanelButton",
        "toolMenu",
        "toolMenu-Document",
        "toolMenu-Editor",
        "toolMenu-Compare",
        "toolMenu-Security",
        "toolMenu-Sign",
        "toolMenu-Form",
        "toolMenu-View",
        "toolMenu-Annotation",
        "handToolButton",
        "cropPageButton",
        "settingButton",
        "downloadButton, ",
        "printButton",
        "flattenButton",
        "downloadButton",
        "flattenButton",
        "printButton",
        "settingButton",
        "openFileButton",
        "fullScreenButton",
        "themeMode"
      ]);
    });
  }, []);

  return (
      <div className={props.className}>
        <div ref={containerRef} style={{ width: "100%", height: "100%", overflow: "hidden", ...props.style }} />
      </div>
  );
};

export default App;
