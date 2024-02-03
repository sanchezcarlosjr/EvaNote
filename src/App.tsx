import {Authenticated, GitHubBanner, Refine, useGetIdentity, useTranslate} from "@refinedev/core";
import {DevtoolsPanel, DevtoolsProvider} from "@refinedev/devtools";
import {RefineKbar, RefineKbarProvider} from "@refinedev/kbar";
import {GitHub, Google, Try} from "@mui/icons-material";

import {
    AuthPage,
    ErrorComponent,
    notificationProvider,
    RefineSnackbarProvider, ThemedHeaderV2,
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
import authProvider from "./authProvider";
import {AppIcon} from "./components/app-icon";
import {Header} from "./components";
import {ColorModeContextProvider} from "./contexts/color-mode";
import {supabaseClient} from "./utility";
import {Evanotebook} from "./applications/evanotebook";
import {ThemedSiderV2} from "./components/layout/sider";
import {useUniformResourceIdentifiers} from "./uniform-resource-identifiers";
import {Title} from "./components/title";
import {ProvisionContextProvider} from "./contexts/provision";


function ProvisionedRefine() {
    const {t, i18n} = useTranslation();

    const resources = useUniformResourceIdentifiers();

    const i18nProvider = {
        translate: (key: string, params: object) => t(key, params),
        changeLocale: (lang: string) => i18n.changeLanguage(lang),
        getLocale: () => i18n.language,
    };

    return <Refine
        dataProvider={dataProvider(supabaseClient)}
        liveProvider={liveProvider(supabaseClient)}
        authProvider={authProvider}
        routerProvider={routerBindings}
        notificationProvider={notificationProvider}
        i18nProvider={i18nProvider}
        resources={resources}
        options={{
            syncWithLocation: true,
            warnWhenUnsavedChanges: true,
            useNewQueryKeys: true,
            projectId: "pjfDKi-64ao4Z-zGOW6b",
        }}
    >
        <Routes>
            <Route
                element={
                    <Authenticated
                        key="authenticated-inner"
                        fallback={<CatchAllNavigate to="/login"/>}
                    >
                        <ThemedLayoutV2
                            Header={() => <Header sticky/>}
                            Sider={ThemedSiderV2}
                            Title={Title}
                        >
                            <Outlet/>
                        </ThemedLayoutV2>
                    </Authenticated>
                }
            >
                {/*:/application?uri=:uri*/}
                <Route
                    index
                    element={<NavigateToResource resource="file:///tmp/getting-started"/>}
                />
                <Route path="/evanotebook">
                    <Route index element={<Evanotebook/>}/>
                </Route>
                <Route path="*" element={<ErrorComponent/>}/>
            </Route>
            <Route
                element={
                    <Authenticated
                        key="authenticated-outer"
                        fallback={<Outlet/>}
                    >
                        <NavigateToResource/>
                    </Authenticated>
                }
            >
                <Route
                    path="/login"
                    element={
                        <AuthPage
                            type="login"
                            title={
                                <ThemedTitleV2
                                    collapsed={false}
                                    text={import.meta.env.VITE_APP_NAME}
                                    icon={<AppIcon/>}
                                />
                            }
                            formProps={{
                                defaultValues: {
                                    email: "",
                                    password: "",
                                },
                            }}
                            providers={[
                                {
                                    name: "google",
                                    label: "Sign in with Google",
                                    icon:
                                        <Google
                                            style={{
                                                fontSize: 18,
                                                lineHeight: 0,
                                            }}
                                        />
                                },
                                {
                                    name: "github",
                                    label: "Sign in with GitHub",
                                    icon:
                                        <GitHub
                                            style={{
                                                fontSize: 18,
                                                lineHeight: 0,
                                            }}
                                        />
                                },
                            ]}
                        />
                    }
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
        <RefineKbar/>
        <UnsavedChangesNotifier/>
        <DocumentTitleHandler/>
    </Refine>;
}

function App() {
    return (
        <BrowserRouter>
            <RefineKbarProvider>
                <ColorModeContextProvider>
                    <CssBaseline/>
                    <GlobalStyles styles={{html: {WebkitFontSmoothing: "auto"}}}/>
                    <RefineSnackbarProvider>
                        <DevtoolsProvider>
                            <ProvisionContextProvider>
                                <ProvisionedRefine/>
                            </ProvisionContextProvider>
                            <DevtoolsPanel/>
                        </DevtoolsProvider>
                    </RefineSnackbarProvider>
                </ColorModeContextProvider>
            </RefineKbarProvider>
        </BrowserRouter>
    );
}

export default App;
