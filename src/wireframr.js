import sketch from "sketch";
const document = sketch.getSelectedDocument();

// check if Shared Style "Wireframr" exists
let length = document.sharedLayerStyles.length;
let preExistingStyle;

for (let i = length; i === 0; i--) {
  if (document.sharedLayerStyles[i].name === "Wireframr") {
    preExistingStyle = document.sharedLayerStyles[i];
    break;
  }
}

// use preexisting style or create new
const wrfrmrSharedStyle = preExistingStyle
  ? preExistingStyle
  : sketch.SharedStyle.fromStyle({
      name: "Wireframr",
      style: {
        borders: [{ color: "#333333" }],
        fills: [{ color: "#ffffff", fillType: sketch.Style.FillType.Color }],
      },
      document: document,
    });

export default function (context) {
  let selection = document.selectedLayers;
  if (selection.isEmpty) {
    sketch.UI.message("Select at least one layer", document);
  } else {
    wireframeSelection(selection);
  }
}

function wireframeSelection(selection) {
  selection.layers.forEach((element) => {
    if (element.type === "Shape" || element.type === "ShapePath") {
      element.sharedStyle = wrfrmrSharedStyle;
      if (element.style.isOutOfSyncWithSharedStyle(wrfrmrSharedStyle)) {
        element.style.syncWithSharedStyle(wrfrmrSharedStyle);
      }
    } else if (element.type === "Text") {
      element.style.fontFamily = "Comic Sans MS";
      if (element.style.fontFamily !== "Comic Sans MS") {
        element.style.fontSize = element.style.fontSize - 2;
      }
      element.style.textColor = "#333333";
    } else if (element.type === "SymbolInstance") {
      let symbolGroup = element.detach({
        recursively: true,
      });
      wireframeSelection(symbolGroup);
    } else if (element.type === "Group" || element.type === "Artboard") {
      wireframeSelection(element);
    } else if (element.type === "Image") {
      element.image = "./assets/wireframeImageStyle.png";
    }
  });
}
