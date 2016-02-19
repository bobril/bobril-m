import * as b from "bobril";
import * as m from "./index";
import * as icons from "bobril-m-icons";

m.initNormalize();
m.initRobotoFonts();

let spacer = { tag: "span", style: { display: "inline-block", width: 8, height: 8 } };

let ch1 = false;
let ch3 = 0;
let rb1 = 0;

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
        ]},
        spacer,
        { tag: "div", children: [
            spacer,
            m.Checkbox({ checked: ch1, action: ()=>{ ch1=!ch1; b.invalidate(); } }),
            m.Checkbox({ checked: ch1, disabled: true }),
            m.Checkbox({ checked: ch3==1, indeterminate: ch3==2, action: ()=>{ ch3=(ch3+1)%3; b.invalidate(); } }),
            m.Checkbox({ checked: ch3==1, indeterminate: ch3==2, disabled: true }),
            m.RadioButton({ checked: rb1==0, action: ()=>{ rb1=0; b.invalidate(); }}),
            m.RadioButton({ checked: rb1==1, action: ()=>{ rb1=1; b.invalidate(); }}),
            m.RadioButton({ checked: rb1==2, action: ()=>{ rb1=2; b.invalidate(); }}),
        ]}
    ];
});
