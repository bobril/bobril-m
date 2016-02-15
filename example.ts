import * as b from "bobril";
import * as m from "./index";

let spacer = { tag: "span", style: { display: "inline-block", width: 8, height: 8 } };

b.init(() => {
    return [
        { tag: "div", children: [
            m.Button({}, "Default"), spacer, 
            m.Button({ feature: m.Feature.Primary }, "Primary"), spacer, 
            m.Button({ feature: m.Feature.Secondary }, "Secondary"), spacer, 
            m.Button({ disabled: true }, "Disabled")
        ]}, 
        spacer,
        { tag: "div", children: [
            m.Button({ type: m.ButtonType.Raised }, "Default"), spacer,
            m.Button({ type: m.ButtonType.Raised, feature: m.Feature.Primary }, "Primary"), spacer,
            m.Button({ type: m.ButtonType.Raised, feature: m.Feature.Secondary }, "Secondary"), spacer, 
            m.Button({ type: m.ButtonType.Raised, disabled: true }, "Disabled")
        ]}
    ];
});
