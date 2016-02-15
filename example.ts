import * as b from "bobril";
import * as m from "./index";
import * as icons from "bobril-m-icons";

m.initNormalize();
m.initRobotoFonts();

let spacer = { tag: "span", style: { display: "inline-block", width: 8, height: 8 } };

b.init(() => {
    return [
        spacer,
        { tag: "div", children: [ 
            spacer,
            m.Button({}, "Default"), spacer, 
            m.Button({ feature: m.Feature.Primary }, "Primary"), spacer, 
            m.Button({ feature: m.Feature.Secondary }, "Secondary"), spacer, 
            m.Button({ disabled: true }, "Disabled")
        ]},
        spacer,
        m.Divider(),
        spacer,
        { tag: "div", children: [
            spacer,
            m.Button({ type: m.ButtonType.Raised }, "Default"), spacer,
            m.Button({ type: m.ButtonType.Raised, feature: m.Feature.Primary }, "Primary"), spacer,
            m.Button({ type: m.ButtonType.Raised, feature: m.Feature.Secondary }, "Secondary"), spacer, 
            m.Button({ type: m.ButtonType.Raised, disabled: true }, "Disabled")
        ]},
        spacer,
        m.Divider({ inset:true }),
        spacer,
        { tag: "div", children: [
            spacer,
            m.Button({ type: m.ButtonType.Floating, icon: icons.contentAdd }), spacer,
            m.Button({ type: m.ButtonType.Floating, feature: m.Feature.Secondary, icon: icons.toggleStar}), spacer, 
            m.Button({ type: m.ButtonType.Floating, disabled: true, icon: icons.toggleStarHalf })
        ]}
    ];
});
