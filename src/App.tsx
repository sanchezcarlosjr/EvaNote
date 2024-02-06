import {Authenticated, Refine} from "@refinedev/core";
import {DevtoolsPanel, DevtoolsProvider} from "@refinedev/devtools";
import {RefineKbar, RefineKbarProvider} from "@refinedev/kbar";
import {GitHub, Google} from "@mui/icons-material";

import {
    AuthPage,
    ErrorComponent,
    notificationProvider,
    RefineSnackbarProvider,
    ThemedLayoutV2,
    ThemedTitleV2,
} from "@refinedev/mui";

import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
import routerBindings, {
    CatchAllNavigate,
    DocumentTitleHandler,
    NavigateToResource,
    UnsavedChangesNotifier,
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
import {MuiInferencer} from "@refinedev/inferencer/mui";
import React, {useContext} from "react";
import {PlaybookExecutor} from "./PlaybookExecutor";

const Evanotebook = React.lazy(() => import("./applications/evanotebook"));
const TextEditor = React.lazy(() => import("./applications/text-editor"));

function ProvisionedRefine() {
    const {t, i18n} = useTranslation();

    const {resources, playbook} = useContext(ProvisionContext);

    const i18nProvider = {
        translate: (key: string, params: object) => t(key, params),
        changeLocale: (lang: string) => i18n.changeLanguage(lang),
        getLocale: () => i18n.language,
    };


    return <ColorModeContextProvider>
        <CssBaseline/>
        <GlobalStyles styles={{
            html: {
                WebkitFontSmoothing: "auto",
                '*': {fontFamily: playbook.settings.theme.fontFamily}
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
                    i18nProvider={i18nProvider}
                    resources={[...resources]}
                    options={{
                        syncWithLocation: true,
                        warnWhenUnsavedChanges: true,
                        useNewQueryKeys: true,
                        disableTelemetry: true,
                        projectId: "pjfDKi-64ao4Z-zGOW6b",
                    }}
                >
                    <Routes>
                        <Route
                            element={<Authenticated
                                key="authenticated-inner"
                                fallback={<CatchAllNavigate to="/login"/>}
                            >
                                <PlaybookExecutor />
                                <ThemedLayoutV2
                                    Header={() => <Header sticky/>}
                                    Sider={ThemedSiderV2}
                                    Title={Title}
                                >
                                    <Outlet/>
                                </ThemedLayoutV2>
                                <RefineKbar/>
                            </Authenticated>}
                        >
                            <Route
                                index
                                element={<h1>Welcome!</h1>}
                            />
                            <Route path="evanotebook">
                                <Route index element={<Evanotebook/>}/>
                            </Route>
                            <Route path="text-editor">
                                <Route index element={<TextEditor/>}/>
                            </Route>
                            <Route path="audit-logs">
                                <Route index element={<MuiInferencer hideCodeViewerInProduction/>}/>
                                <Route path="show/:id" element={<MuiInferencer hideCodeViewerInProduction/>}/>
                            </Route>
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
                                element={<AuthPage type="register"/>}
                            />
                            <Route
                                path="/forgot-password"
                                element={<AuthPage type="forgotPassword"/>}
                            />
                        </Route>
                    </Routes>
                    <UnsavedChangesNotifier/>
                    <DocumentTitleHandler/>
                </Refine>
                <DevtoolsPanel/>
            </DevtoolsProvider>
        </RefineSnackbarProvider>
    </ColorModeContextProvider>;
}

function App() {
    return (<BrowserRouter>
        <RefineKbarProvider options={{enableHistory: true}}>
            <ProvisionContextProvider>
                <ProvisionedRefine />
            </ProvisionContextProvider>
        </RefineKbarProvider>
    </BrowserRouter>);
}

export default App;
