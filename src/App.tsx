import {Authenticated, CanAccess, Refine} from "@refinedev/core";
import {DevtoolsPanel, DevtoolsProvider} from "@refinedev/devtools";
import {RefineKbar, RefineKbarProvider} from "@refinedev/kbar";
import {GitHub, Google} from "@mui/icons-material";

import {AuthPage, ErrorComponent, notificationProvider, RefineSnackbarProvider, ThemedTitleV2,} from "@refinedev/mui";

import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
import routerBindings, {
    CatchAllNavigate, DocumentTitleHandler, NavigateToResource, UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import {dataProvider, liveProvider} from "@refinedev/supabase";
import {useTranslation} from "react-i18next";
import {BrowserRouter, Outlet, Route, Routes} from "react-router-dom";
import authProvider from "./providers/authProvider";
import {AppIcon} from "./components/app-icon";
import {Header} from "./components";
import {ColorModeContextProvider} from "./contexts/color-mode";
import {supabaseClient} from "./utility";
import {ThemedSiderV2} from "./components/layout/sider";
import {Title} from "./components/title";
import {ProvisionContext, ProvisionContextProvider} from "./contexts/provision";
import React, {useContext} from "react";
import {PlaybookExecutor} from "./PlaybookExecutor";
import {ThemedLayoutV2} from "./components/layout";
import {accessControlProvider} from "./providers/access-control-provider";
import {RightSider} from "./components/header/rightSider";


const Indexer = React.lazy(() => import("./applications/indexer"));

function ProvisionedRefine() {
    const {t, i18n} = useTranslation();

    const {resources, routes, playbook} = useContext(ProvisionContext);

    const i18nProvider = {
        translate: (key: string, params: object) => t(key, params),
        changeLocale: (lang: string) => i18n.changeLanguage(lang),
        getLocale: () => i18n.language,
    };

    return (<ColorModeContextProvider>
            <CssBaseline/>
            <GlobalStyles styles={{
                html: {
                    WebkitFontSmoothing: "auto",
                    'body :not(.katex-html span)': {
                        fontFamily: playbook.settings.theme.fontFamily,
                        fontFeatureSettings: `"cv12", "cv06", "ss03", "ss02", "ss03"`,
                        fontVariant: "common-ligatures;"
                    }
                },
                "::selection": {
                    background: "rgba(35, 131, 226, .28)"
                },
                ".bn-container[data-color-scheme=dark]": {
                   "--bn-colors-editor-background": "#121212"
                },
                ".bn-container .cm-editor *": {
                    fontFamily: '"Fira Code" !important',
                    fontFeatureSettings: `"cv12", "cv06", "ss03", "ss02", "ss03"`,
                    fontVariant: "common-ligatures;",
                    letterSpacing: 0
                },
                ".cm-editor.cm-focused": {
                    "outline": "none !important"
                }
            }}/>
            <RefineSnackbarProvider>
                <DevtoolsProvider>
                    <Refine
                        dataProvider={dataProvider(supabaseClient)}
                        liveProvider={liveProvider(supabaseClient)}
                        authProvider={authProvider}
                        routerProvider={routerBindings}
                        notificationProvider={notificationProvider}
                        accessControlProvider={accessControlProvider}
                        i18nProvider={i18nProvider}
                        resources={resources}
                        options={{
                            syncWithLocation: true,
                            warnWhenUnsavedChanges: true,
                            useNewQueryKeys: true,
                            disableTelemetry: true,
                            projectId: "pjfDKi-64ao4Z-zGOW6b",
                        }}
                    >
                        <PlaybookExecutor/>
                        <Routes>
                            <Route
                                element={<Authenticated
                                    key="authenticated-inner"
                                    fallback={<CatchAllNavigate to="/login"/>}
                                >
                                    <ThemedLayoutV2
                                        Header={Header}
                                        Sider={ThemedSiderV2}
                                        OffLayoutArea={RightSider}
                                        Title={Title}
                                    >
                                        <CanAccess fallback={<ErrorComponent/>}>
                                            <Outlet/>
                                        </CanAccess>
                                    </ThemedLayoutV2>
                                    <RefineKbar/>
                                </Authenticated>}
                            >
                                <Route
                                    index
                                    element={<Indexer/>}
                                />
                                {routes.map(route => <Route key={route.path} path={route.path}
                                                            element={route.element}/>)}
                                <Route path="*" element={<ErrorComponent/>}/>
                            </Route>
                            <Route
                                element={<Authenticated
                                    key="authenticated-outer"
                                    fallback={<Outlet/>}
                                >
                                    <NavigateToResource/>
                                </Authenticated>}
                            >
                                <Route
                                    path="/login"
                                    element={<AuthPage
                                        type="login"
                                        title={<ThemedTitleV2
                                            collapsed={false}
                                            text={import.meta.env.VITE_APP_NAME}
                                            icon={<AppIcon/>}
                                        />}

                                        formProps={{
                                            defaultValues: {
                                                email: "", password: "",
                                            },
                                        }}
                                        providers={[{
                                            name: "google", label: "Sign in with Google", icon: <Google
                                                style={{
                                                    fontSize: 18, lineHeight: 0,
                                                }}
                                            />
                                        }, {
                                            name: "github", label: "Sign in with GitHub", icon: <GitHub
                                                style={{
                                                    fontSize: 18, lineHeight: 0,
                                                }}
                                            />
                                        },]}
                                    />}
                                />
                                <Route
                                    path="/register"
                                    element={<AuthPage
                                        title={<ThemedTitleV2
                                            collapsed={false}
                                            text={import.meta.env.VITE_APP_NAME}
                                            icon={<AppIcon/>}
                                        />}
                                        providers={[{
                                            name: "google", label: "Sign in with Google", icon: <Google
                                                style={{
                                                    fontSize: 18, lineHeight: 0,
                                                }}
                                            />
                                        }, {
                                            name: "github", label: "Sign in with GitHub", icon: <GitHub
                                                style={{
                                                    fontSize: 18, lineHeight: 0,
                                                }}
                                            />
                                        },]}
                                        type="register"/>}
                                />
                                <Route
                                    path="/forgot-password"
                                    element={<AuthPage type="forgotPassword"/>}
                                />
                            </Route>
                            <Route
                                path="/login"
                                element={<AuthPage
                                    type="login"
                                    title={<ThemedTitleV2
                                        collapsed={false}
                                        text={import.meta.env.VITE_APP_NAME}
                                        icon={<AppIcon/>}
                                    />}

                                    formProps={{
                                        defaultValues: {
                                            email: "", password: "",
                                        },
                                    }}
                                    providers={[{
                                        name: "google", label: "Sign in with Google", icon: <Google
                                            style={{
                                                fontSize: 18, lineHeight: 0,
                                            }}
                                        />
                                    }, {
                                        name: "github", label: "Sign in with GitHub", icon: <GitHub
                                            style={{
                                                fontSize: 18, lineHeight: 0,
                                            }}
                                        />
                                    },]}
                                />}
                            />
                        </Routes>
                        <UnsavedChangesNotifier/>
                        <DocumentTitleHandler/>
                    </Refine>
                    <DevtoolsPanel/>
                </DevtoolsProvider>
            </RefineSnackbarProvider>
        </ColorModeContextProvider>);
}

function App() {
    return (<BrowserRouter>
        <RefineKbarProvider options={{enableHistory: true}}>
            <ProvisionContextProvider>
                <ProvisionedRefine/>
            </ProvisionContextProvider>
        </RefineKbarProvider>
    </BrowserRouter>);
}

export default App;
