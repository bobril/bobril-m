import * as b from "bobril";
import * as m from "./index";
import * as icons from "bobril-m-icons";

m.initRobotoFonts();

const navigationWidth = 250;

let getPageContent: () => b.IBobrilChildren = getBadgePreview;

let examplePaper = b.styleDef({
    width: 100,
    height: 100,
    margin: 16,
    padding: 34,
    textAlign: "center",
    display: "inline-block"
});
let ch1 = false;
let s1 = false;
let s2 = true;
let s3 = false;
let ch3 = 0;
let rb1 = b.propi(0);
let slider1 = b.propi(0);
let slider2 = b.propi(10);
let str1 = b.propi("");
let str2 = b.propi("");
let str3 = b.propi("");
let str4 = b.propi("");
let str5 = b.propi("");

function createFlexLayout(children: b.IBobrilNode[]): b.IBobrilNode {
    return b.styledDiv(
        children.map(child => {
            return b.styledDiv(child, { flex: 1 });
        }),
        { display: "flex" }
    );
}

function createAvatar(content: string): b.IBobrilNode {
    return {
        tag: "svg",
        attrs: { width: 40, height: 40 },
        children: [
            {
                tag: "circle",
                attrs: {
                    cx: "20",
                    cy: "20",
                    r: "18",
                    stroke: m.primary2Color(),
                    "stroke-width": "2",
                    fill: m.transparent
                }
            },
            {
                tag: "text",
                attrs: {
                    "text-anchor": "middle",
                    dy: ".4em",
                    x: "20",
                    y: "19",
                    fill: m.primary2Color(),
                    "font-size": 24
                },
                children: content
            }
        ]
    };
}

function getBadgePreview(): b.IBobrilChildren {
    return m.Paper({ zDepth: 0, style: { margin: 16, padding: 8 } }, [
        m.Badge({ badgeContent: "0" }, "Normal Badge"),
        m.Badge({ badgeContent: "1", primary: true }, "Primary"),
        m.Badge({ badgeContent: "99+", secondary: true }, "Secondary")
    ]);
}

function getButtonPreview(): b.IBobrilChildren {
    return [
        m.Paper({ style: { margin: 16, padding: 8 } }, [
            m.Button({}, "Default"),
            m.Spacer(),
            m.Button({ feature: m.Feature.Primary }, "Primary"),
            m.Spacer(),
            m.Button({ feature: m.Feature.Secondary }, "Secondary"),
            m.Spacer(),
            m.Button({ disabled: true }, "Disabled")
        ]),
        m.Paper({ style: { margin: 16, padding: 8 } }, [
            m.Button({ type: m.ButtonType.Raised }, "Default"),
            m.Spacer(),
            m.Button(
                { type: m.ButtonType.Raised, feature: m.Feature.Primary },
                "Primary"
            ),
            m.Spacer(),
            m.Button(
                { type: m.ButtonType.Raised, feature: m.Feature.Secondary },
                "Secondary"
            ),
            m.Spacer(),
            m.Button({ type: m.ButtonType.Raised, disabled: true }, "Disabled")
        ]),
        m.Paper({ style: { margin: 16, padding: 8 } }, [
            m.Button({ type: m.ButtonType.Floating, icon: icons.contentAdd() }),
            m.Spacer(),
            m.Button({
                type: m.ButtonType.Floating,
                feature: m.Feature.Secondary,
                icon: icons.toggleStar()
            }),
            m.Spacer(),
            m.Button({
                type: m.ButtonType.Floating,
                disabled: true,
                icon: icons.toggleStarHalf()
            })
        ])
    ];
}

function getCheckboxPreview(): b.IBobrilChildren {
    return m.Paper({ style: { margin: 16, padding: 8 } }, [
        b.withKey(
            m.Checkbox(
                {
                    checked: ch1,
                    action: () => {
                        ch1 = !ch1;
                        b.invalidate();
                    }
                },
                "Two state Checkbox"
            ),
            "ch1"
        ),
        b.withKey(
            m.Checkbox({ checked: ch1, disabled: true }, "Disabled two state"),
            "ch2"
        ),
        m.Divider(),
        b.withKey(
            m.Checkbox(
                {
                    checked: ch3 == 1,
                    indeterminate: ch3 == 2,
                    action: () => {
                        ch3 = (ch3 + 1) % 3;
                        b.invalidate();
                    }
                },
                "Three state Checkbox"
            ),
            "ch3"
        ),
        b.withKey(
            m.Checkbox(
                { checked: ch3 == 1, indeterminate: ch3 == 2, disabled: true },
                "Disabled three state"
            ),
            "ch4"
        )
    ]);
}

function getListPreview(): b.IBobrilChildren {
    return createFlexLayout([
        m.Paper({ style: { margin: 16 } }, [
            m.List({}, [
                m.Subheader({}, "Simple list"),
                m.ListItem({
                    leftIcon: icons.contentInbox(),
                    primaryText: "Inbox"
                }),
                m.ListItem({
                    leftIcon: icons.actionGrade(),
                    primaryText: "Starred"
                }),
                m.ListItem({
                    leftIcon: icons.contentSend(),
                    primaryText: "Send mail"
                })
            ]),
            m.Divider(),
            m.List({}, [
                m.Subheader({}, "Simple list"),
                m.ListItem({
                    rightIcon: icons.actionInfo(),
                    primaryText: "All mail",
                    secondaryText: "All mail",
                    secondaryTextLines: m.SecondaryTextLines.Single
                }),
                m.ListItem({
                    rightIcon: icons.actionInfo(),
                    primaryText: "Trash",
                    secondaryText: "Trash",
                    secondaryTextLines: m.SecondaryTextLines.Single
                }),
                m.ListItem({
                    rightIcon: icons.actionInfo(),
                    primaryText: "Spam"
                })
            ])
        ]),
        m.Paper({ style: { margin: 16 } }, [
            m.List({}, [
                m.Subheader({}, "Nested list"),
                m.ListItem({
                    leftIcon: icons.contentInbox(),
                    primaryText: "Inbox",
                    nestedItems: [
                        m.Subheader({ inset: true }, "Nested list"),
                        m.ListItem({
                            leftIcon: icons.actionGrade(),
                            primaryText: "Starred"
                        }),
                        m.ListItem({
                            leftIcon: icons.contentSend(),
                            primaryText: "Send mail",
                            disabled: true,
                            nestedItems: [
                                m.ListItem({
                                    leftIcon: icons.contentSend(),
                                    primaryText: "Google"
                                }),
                                m.Divider({ inset: true }),
                                m.ListItem({
                                    leftIcon: icons.contentSend(),
                                    primaryText: "Outlook"
                                })
                            ]
                        })
                    ]
                })
            ])
        ]),
        m.Paper({ style: { margin: 16 } }, [
            m.List({}, [
                m.Subheader({}, "Settings list"),
                m.ListItem({
                    primaryText: "Notifications",
                    secondaryText: "Allow notifications",
                    secondaryTextLines: m.SecondaryTextLines.Single,
                    leftCheckbox: m.Checkbox({
                        checked: ch1,
                        action: () => {
                            ch1 = !ch1;
                            b.invalidate();
                        }
                    }),
                    action: () => {
                        ch1 = !ch1;
                        b.invalidate();
                    }
                }),
                m.Divider(),
                m.ListItem({
                    primaryText: "Events and reminders",
                    secondaryText: "Events and reminders",
                    secondaryTextLines: m.SecondaryTextLines.Single,
                    rightToggle: m.Toggle({
                        checked: ch1,
                        action: () => {
                            ch1 = !ch1;
                            b.invalidate();
                        }
                    }),
                    action: () => {
                        ch1 = !ch1;
                        b.invalidate();
                    }
                })
            ])
        ]),
        m.Paper({ style: { margin: 16 } }, [
            m.List({}, [
                m.Subheader({}, "Messages list"),
                m.ListItem({
                    primaryText: "Subject",
                    secondaryText:
                        "Text of message - Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Maecenas lorem.",
                    secondaryTextLines: m.SecondaryTextLines.Double,
                    leftAvatar: createAvatar("A")
                }),
                m.Divider({ inset: true }),
                m.ListItem({
                    primaryText: "Subject",
                    secondaryText:
                        "Text of message - Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Maecenas lorem.",
                    secondaryTextLines: m.SecondaryTextLines.Double,
                    leftAvatar: createAvatar("B")
                })
            ])
        ]),
        m.Paper({ style: { margin: 16 } }, [
            m.List({}, [
                m.Subheader({}, "Selectable list"),
                m.ListItem({
                    primaryText: "Selectable Item 1",
                    selected: s1,
                    action: () => {
                        s1 = !s1;
                        s2 = s3 = false;
                        b.invalidate();
                    }
                }),
                m.ListItem({
                    primaryText: "Selectable Item 2",
                    selected: s2,
                    action: () => {
                        s2 = !s2;
                        s1 = s3 = false;
                        b.invalidate();
                    }
                }),
                m.ListItem({
                    primaryText: "Selectable Item 3",
                    selected: s3,
                    action: () => {
                        s3 = !s3;
                        s1 = s2 = false;
                        b.invalidate();
                    }
                })
            ])
        ])
    ]);
}

function getMenuPreview(): b.IBobrilChildren {
    return createFlexLayout([
        m.Paper({ style: { margin: 16 } }, [
            m.Menu({}, [
                m.MenuItem({ primaryText: "Maps" }),
                m.MenuItem({ primaryText: "Books", disabled: true }),
                m.Divider(),
                m.MenuItem({ primaryText: "Flights" }),
                m.MenuItem({ primaryText: "Apps" })
            ])
        ]),
        m.Paper({ style: { margin: 16 } }, [
            m.Menu({}, [
                m.MenuItem({
                    primaryText: "Maps",
                    leftIcon: icons.mapsDirections()
                }),
                m.MenuItem({
                    primaryText: "Bookmarks",
                    disabled: true,
                    leftIcon: icons.actionBookmark()
                }),
                m.Divider(),
                m.MenuItem({
                    primaryText: "Flights",
                    rightIcon: icons.mapsFlight()
                }),
                m.MenuItem({
                    primaryText: "Apps",
                    rightIcon: icons.actionAlarm()
                })
            ])
        ]),
        m.Paper({ style: { display: "inline-block", margin: 16 } }, [
            m.Menu({ desktop: false }, [
                m.MenuItem({
                    primaryText: "Books",
                    insetChildren: true,
                    menuItems: [
                        m.MenuItem({
                            primaryText: "Programming",
                            menuItems: [
                                m.MenuItem({
                                    primaryText: "TypeScript",
                                    action: () => {
                                        console.log("ts");
                                    }
                                }),
                                m.MenuItem({
                                    primaryText: "JavaScript",
                                    action: () => {
                                        console.log("js");
                                    }
                                })
                            ]
                        }),
                        m.MenuItem({
                            primaryText: "Testing",
                            disabled: true
                        })
                    ]
                }),
                m.MenuItem({
                    primaryText: "Handbooks",
                    checked: true
                }),
                m.Divider(),
                m.MenuItem({
                    primaryText: "Whatever"
                })
            ])
        ]),
        m.Paper({ style: { margin: 16 } }, [
            m.Menu({ desktop: true }, [
                m.MenuItem({
                    primaryText: "Maps",
                    leftIcon: icons.mapsDirections(),
                    desktop: true
                }),
                m.MenuItem({
                    primaryText: "Bookmarks",
                    disabled: true,
                    leftIcon: icons.actionBookmark()
                }),
                m.Divider(),
                m.MenuItem({
                    primaryText: "Flights",
                    rightIcon: icons.mapsFlight()
                }),
                m.MenuItem({
                    primaryText: "Apps",
                    rightIcon: icons.actionAlarm()
                })
            ])
        ]),
        m.Paper({ style: { margin: 16 } }, [
            m.Menu({ desktop: true }, [
                m.MenuItem({ primaryText: "Bold", secondaryText: "⌘B" }),
                m.MenuItem({ primaryText: "Italic", secondaryText: "⌘I" }),
                m.MenuItem({ primaryText: "Underline", secondaryText: "⌘U" }),
                m.Divider(),
                m.MenuItem({
                    primaryText: "Clear formatting",
                    secondaryText: "⌘/"
                })
            ])
        ])
    ]);
}

function getRadioButtonPreview(): b.IBobrilChildren {
    return m.Paper({ style: { margin: 16, padding: 8 } }, [
        m.RadioButtonGroup({ value: rb1, unselectedValue: -1 }, [
            b.withKey(m.RadioButton({ value: 0 }, "Option A"), "rb1"),
            b.withKey(m.RadioButton({ value: 1 }, "Option B"), "rb2"),
            b.withKey(m.RadioButton({ value: 2 }, "Option C"), "rb3"),
            b.withKey(
                m.RadioButton({ value: 3, disabled: true }, "Disabled Option"),
                "rb4"
            )
        ])
    ]);
}

function getSliderPreview(): b.IBobrilChildren {
    return m.Paper({ zDepth: 0, style: { margin: 16, padding: 8 } }, [
        b.withKey(m.Slider({ value: slider1 }), "s1"),
        b.withKey(m.Slider({ value: slider1, disabled: true }), "s2"),
        b.withKey(m.Slider({ value: slider2, min: 5, max: 15, step: 1 }), "s3"),
        b.withKey(
            m.Slider({
                value: slider2,
                min: 5,
                max: 15,
                step: 1,
                disabled: true
            }),
            "s4"
        )
    ]);
}

function getTextFieldPreview(): b.IBobrilChildren {
    return m.Paper({ zDepth: 0, style: { margin: 16, padding: 8 } }, [
        b.withKey(m.TextField({ value: str1, labelText: "First Name" }), "tf1"),
        b.withKey(
            m.TextField({
                value: str2,
                labelText: "Last Name",
                errorText: str2() == "" ? "This field is required" : null
            }),
            "tf2"
        ),
        b.withKey(
            m.TextField({
                value: str5,
                labelText: "Password",
                inputType: "password"
            }),
            "tf3"
        ),
        b.withKey(
            m.TextField({ value: str3, hintText: "Hint text and no label" }),
            "tf4"
        ),
        b.withKey(
            m.TextField({
                value: str3,
                labelText: "Disabled with label",
                disabled: true
            }),
            "tf5"
        ),
        b.withKey(
            m.TextField({
                value: str4,
                rows: 2,
                rowsMax: 4,
                hintText: "Multiline 2-4 rows, Hint text and no label"
            }),
            "tf6"
        ),
        b.withKey(
            m.TextField({
                value: str4,
                rows: 2,
                rowsMax: 4,
                labelText: "Multiline 2-4 rows, Disabled with label",
                disabled: true
            }),
            "tf7"
        )
    ]);
}

function getPaperPreview(): b.IBobrilChildren {
    return [
        m.Paper({ zDepth: 0, style: { margin: 16, padding: 8 } }, [
            m.Paper({ zDepth: 1, style: examplePaper }, "1"),
            m.Paper({ zDepth: 2, style: examplePaper }, "2"),
            m.Paper({ zDepth: 3, style: examplePaper }, "3"),
            m.Paper({ zDepth: 4, style: examplePaper }, "4"),
            m.Paper({ zDepth: 5, style: examplePaper }, "5")
        ]),
        m.Paper({ zDepth: 0, style: { margin: 16, padding: 8 } }, [
            m.Paper({ zDepth: 1, round: false, style: examplePaper }, "1"),
            m.Paper({ zDepth: 2, round: false, style: examplePaper }, "2"),
            m.Paper({ zDepth: 3, round: false, style: examplePaper }, "3"),
            m.Paper({ zDepth: 4, round: false, style: examplePaper }, "4"),
            m.Paper({ zDepth: 5, round: false, style: examplePaper }, "5")
        ]),
        m.Paper({ zDepth: 0, style: { margin: 16, padding: 8 } }, [
            m.Paper({ zDepth: 1, circle: true, style: examplePaper }, "1"),
            m.Paper({ zDepth: 2, circle: true, style: examplePaper }, "2"),
            m.Paper({ zDepth: 3, circle: true, style: examplePaper }, "3"),
            m.Paper({ zDepth: 4, circle: true, style: examplePaper }, "4"),
            m.Paper({ zDepth: 5, circle: true, style: examplePaper }, "5")
        ])
    ];
}

function createNavigationItem(
    text: string,
    contentCallback: () => b.IBobrilChildren
): b.IBobrilNode {
    return m.ListItem({
        primaryText: text,
        action: () => {
            getPageContent = contentCallback;
            b.invalidate();
        }
    });
}

function createNavigation(): b.IBobrilNode {
    return m.Paper(
        {
            zDepth: 3,
            style: {
                position: "absolute",
                top: 0,
                bottom: 0,
                width: navigationWidth
            }
        },
        m.List({}, [
            createNavigationItem("Badge", getBadgePreview),
            createNavigationItem("Button", getButtonPreview),
            createNavigationItem("Checkbox", getCheckboxPreview),
            createNavigationItem("List", getListPreview),
            createNavigationItem("Menu", getMenuPreview),
            createNavigationItem("Paper", getPaperPreview),
            createNavigationItem("Radio Button", getRadioButtonPreview),
            createNavigationItem("Slider", getSliderPreview),
            createNavigationItem("Text Field", getTextFieldPreview)
        ])
    );
}

function createHeaderContent(): b.IBobrilNode {
    return m.Paper({ zDepth: 0, style: { margin: 16, padding: 8 } }, [
        m.Button(
            { type: m.ButtonType.Raised, action: () => m.lightTheme() },
            "Light Theme"
        ),
        m.Spacer(),
        m.Button(
            { type: m.ButtonType.Raised, action: () => m.darkTheme() },
            "Dark Theme"
        )
    ]);
}

b.init(() => {
    return [
        b.styledDiv([createHeaderContent(), getPageContent()], {
            paddingTop: 1,
            paddingLeft: navigationWidth,
            paddingBottom: 1
        }),
        createNavigation()
    ];
});
