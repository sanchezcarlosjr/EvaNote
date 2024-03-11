import {Authenticated, CanAccess, Refine} from "@refinedev/core";
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
import React, {useContext} from "react";
import {PlaybookExecutor} from "./PlaybookExecutor";
import {accessControlProvider} from "./providers/access-control-provider";


const Indexer = React.lazy(() => import("./applications/indexer"));

function ProvisionedRefine() {
    const {t, i18n} = useTranslation();

    const {resources, routes, playbook} = useContext(ProvisionContext);

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
                '* :not(.katex-html span)': {fontFamily: playbook.settings.theme.fontFamily}
            }
        }}/>
        <RefineSnackbarProvider>
            <DevtoolsProvider>
                <Refine
                    dataProvider={dataProvider(supabaseClient)}
                    liveProvider={liveProvider(supabaseClient)}
                    authProvider={authProvider}
                    accessControlProvider={accessControlProvider}
                    routerProvider={routerBindings}
                    notificationProvider={notificationProvider}
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
                    <PlaybookExecutor />
                    <Routes>
                        <Route
                            element={<Authenticated
                                key="authenticated-inner"
                                fallback={<CatchAllNavigate to="/login"/>}
                            >
                                <ThemedLayoutV2
                                    Header={() => <Header sticky />}
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
                                    element={<Indexer />}
                                />
                                {
                                    routes.map(route =>
                                        <Route key={route.path} path={route.path}>
                                            <Route index element={route.element}/>
                                        </Route>
                                    )
                                }
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
