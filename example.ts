import * as b from "bobril";
import * as m from "./index";
import * as icons from "bobril-m-icons";

m.initNormalize();
m.initRobotoFonts();

let spacer = { tag: "span", style: { display: "inline-block", width: 8, height: 8 } };
let examplePaper = b.styleDef({ width: 100, height: 100, margin: 16, padding: 34, textAlign: "center", display: "inline-block" });
let ch1 = false;
let ch3 = 0;
let rb1 = b.propi(0);
let slider1 = b.propi(0);
let slider2 = b.propi(10);

b.init(() => {
    return [
        m.Paper({ zDepth: 1, style: { margin: 16, padding: 8 } }, [
            m.Slider({ value: slider1 }),
            m.Slider({ value: slider1, disabled: true }),
            m.Slider({ value: slider2, min: 5, max: 15, step: 1}),
            m.Slider({ value: slider2, min: 5, max: 15, step: 1, disabled: true }),
        ]),
        m.Paper({ zDepth: 0, style: { margin: 16, padding: 8 } }, [
            m.Paper({ zDepth: 1, style: examplePaper }, "1"),
            m.Paper({ zDepth: 2, style: examplePaper }, "2"),
            m.Paper({ zDepth: 3, style: examplePaper }, "3"),
            m.Paper({ zDepth: 4, style: examplePaper }, "4"),
            m.Paper({ zDepth: 5, style: examplePaper }, "5"),
        ]),
        m.Paper({ zDepth: 0, style: { margin: 16, padding: 8 } }, [
            m.Paper({ zDepth: 1, round: false, style: examplePaper }, "1"),
            m.Paper({ zDepth: 2, round: false, style: examplePaper }, "2"),
            m.Paper({ zDepth: 3, round: false, style: examplePaper }, "3"),
            m.Paper({ zDepth: 4, round: false, style: examplePaper }, "4"),
            m.Paper({ zDepth: 5, round: false, style: examplePaper }, "5"),
        ]),
        m.Paper({ zDepth: 0, style: { margin: 16, padding: 8 } }, [
            m.Paper({ zDepth: 1, circle: true, style: examplePaper }, "1"),
            m.Paper({ zDepth: 2, circle: true, style: examplePaper }, "2"),
            m.Paper({ zDepth: 3, circle: true, style: examplePaper }, "3"),
            m.Paper({ zDepth: 4, circle: true, style: examplePaper }, "4"),
            m.Paper({ zDepth: 5, circle: true, style: examplePaper }, "5"),
        ]),
        m.Paper({ style: { margin: 16, padding: 8 } }, [
            m.Button({}, "Default"), spacer,
            m.Button({ feature: m.Feature.Primary }, "Primary"), spacer,
            m.Button({ feature: m.Feature.Secondary }, "Secondary"), spacer,
            m.Button({ disabled: true }, "Disabled")
        ]),
        m.Paper({ style: { margin: 16, padding: 8 } }, [
            m.Button({ type: m.ButtonType.Raised }, "Default"), spacer,
            m.Button({ type: m.ButtonType.Raised, feature: m.Feature.Primary }, "Primary"), spacer,
            m.Button({ type: m.ButtonType.Raised, feature: m.Feature.Secondary }, "Secondary"), spacer,
            m.Button({ type: m.ButtonType.Raised, disabled: true }, "Disabled")
        ]),
        m.Paper({ style: { margin: 16, padding: 8 } }, [
            m.Button({ type: m.ButtonType.Floating, icon: icons.contentAdd }), spacer,
            m.Button({ type: m.ButtonType.Floating, feature: m.Feature.Secondary, icon: icons.toggleStar }), spacer,
            m.Button({ type: m.ButtonType.Floating, disabled: true, icon: icons.toggleStarHalf })
        ]),
        m.Paper({ style: { margin: 16, padding: 8 } }, [
            m.Checkbox({ checked: ch1, action: () => { ch1 = !ch1; b.invalidate(); } }, "Two state Checkbox"),
            m.Checkbox({ checked: ch1, disabled: true }, "Disabled two state"),
            m.Divider(),
            m.Checkbox({ checked: ch3 == 1, indeterminate: ch3 == 2, action: () => { ch3 = (ch3 + 1) % 3; b.invalidate(); } }, "Three state Checkbox"),
            m.Checkbox({ checked: ch3 == 1, indeterminate: ch3 == 2, disabled: true }, "Disabled three state")
        ]),
        m.Paper({ style: { margin: 16, padding: 8 } }, [
            m.RadioButtonGroup({ value: rb1, unselectedValue: -1 }, [
                m.RadioButton({ value: 0 }, "Option A"),
                m.RadioButton({ value: 1 }, "Option B"),
                m.RadioButton({ value: 2 }, "Option C"),
                m.RadioButton({ value: 3, disabled: true }, "Disabled Option")
            ])
        ])
    ];
});
