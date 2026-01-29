import { useEffect, useRef } from 'react';
import ComPDFKitViewer from '@compdfkit_pdf_sdk/webviewer';

export default function WebViewer() {
    const containerRef = useRef(null);

    useEffect(() => {
        let docViewer = null;
        ComPDFKitViewer.init(
            {
                path: "/",
                pdfUrl: "./example/modified_template.pdf",
                css: "/webviewer.css",
                license: process.env.REACT_APP_API_KEY,
                disableDigitalSignature: true,
                autoJumpNextSign: true
            },
            containerRef.current
        ).then((instance) => {
            docViewer = instance.docViewer;
            const { UI } = instance;
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
            //
            // UI.disableSignatureTool();
            //
            // docViewer.addEvent("documentloaded", async () => {
            //     // props.onLoad?.(docViewer);
            //     if (window.innerWidth > 600) {
            //         docViewer.webViewerScaleChanged( 1.5);
            //     }
            //     const elements = document.querySelectorAll(`.color-tool`);
            //     elements.forEach((el) => {
            //         (el).style.display = "none";
            //     });
            // });
            // docViewer.addEvent("signedComplete", async (data) => {
            //     if (data.unSignedNumber === 0) {
            //         const docStream = await docViewer.flattenPdf();
            //         const docBlob = new Blob([docStream], { type: "application/pdf" });
            //         // props.handleSave(docBlob);
            //     }
            // });
            docViewer.getAnnotationManager().enableIndicator(false);
            docViewer.setConsecutiveType("sign");//sign, signForm, form
            docViewer.getAnnotationManager().setFormOrder('CREATE'); // CREATE OR DISTANCE

            UI.setFormBoardFold(true)
            UI.setFormBoardPosition({left: 150, top: 150})

            docViewer.addEvent("message", (data) => {
                if (data.type === "ERROR") {
                    // props.stopLoader();
                    // props.handleError?.(data);
                    // props.showToast({
                    //     title: transformPhrase("something_went_wrong", props.UiLanguage, {}),
                    //     description: transformPhrase("compdf_error", props.UiLanguage, { msg: data.message }),
                    //     color: "error",
                    //     time: 10000
                    // });
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

    return <div ref={containerRef} style={{ width: "100%", height: "100vh", overflow: "hidden" }} />
}