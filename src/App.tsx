import {Authenticated, GitHubBanner, Refine, useTranslate} from "@refinedev/core";
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
import authProvider from "./authProvider";
import {AppIcon} from "./components/app-icon";
import {Header} from "./components/header";
import {ColorModeContextProvider} from "./contexts/color-mode";
import {
    BlogPostCreate,
    BlogPostEdit,
    BlogPostList,
    BlogPostShow,
} from "./pages/blog-posts";
import {
    CategoryCreate,
    CategoryEdit,
    CategoryList,
    CategoryShow,
} from "./pages/categories";
import {supabaseClient} from "./utility";
import {Evanotebook} from "./applications/evanotebook";

function App() {
    const {t, i18n} = useTranslation();

    const i18nProvider = {
        translate: (key: string, params: object) => t(key, params),
        changeLocale: (lang: string) => i18n.changeLanguage(lang),
        getLocale: () => i18n.language,
    };

    return (
        <BrowserRouter>
            <RefineKbarProvider>
                <ColorModeContextProvider>
                    <CssBaseline/>
                    <GlobalStyles styles={{html: {WebkitFontSmoothing: "auto"}}}/>
                    <RefineSnackbarProvider>
                        <DevtoolsProvider>
                            <Refine
                                dataProvider={dataProvider(supabaseClient)}
                                liveProvider={liveProvider(supabaseClient)}
                                authProvider={authProvider}
                                routerProvider={routerBindings}
                                notificationProvider={notificationProvider}
                                i18nProvider={i18nProvider}
                                resources={[
                                    {
                                        name: "Resource 1",
                                        identifier: "url",
                                        show: "applications/evanotebook"
                                    }
                                ]}
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
                                                    Title={({collapsed}) => (
                                                        <ThemedTitleV2
                                                            collapsed={collapsed}
                                                            text={import.meta.env.VITE_APP_NAME}
                                                            icon={<AppIcon/>}
                                                        />
                                                    )}
                                                >
                                                    <Outlet/>
                                                </ThemedLayoutV2>
                                            </Authenticated>
                                        }
                                    >
                                        <Route
                                            index
                                            element={<NavigateToResource resource="blog_posts"/>}
                                        />
                                        {/*:/application?uri=:uri*/}
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
                                                            email: "info@refine.dev",
                                                            password: "refine-supabase",
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
                            </Refine>
                            <DevtoolsPanel/>
                        </DevtoolsProvider>
                    </RefineSnackbarProvider>
                </ColorModeContextProvider>
            </RefineKbarProvider>
        </BrowserRouter>
    );
}

export default App;
