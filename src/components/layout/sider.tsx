import React, { CSSProperties, useState } from "react";
import {
  CanAccess,
  ITreeMenu,
  useIsExistAuthentication,
  useLogout,
  useTitle,
  useTranslate,
  useRouterContext,
  useRouterType,
  useLink,
  useMenu,
  useRefineContext,
  useActiveAuthProvider,
  pickNotDeprecated,
  useWarnAboutChange,
} from "@refinedev/core";
import {
  ThemedTitleV2 as DefaultTitle,
  useThemedLayoutContext,
} from "@refinedev/mui";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import Dashboard from "@mui/icons-material/Dashboard";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ListOutlined from "@mui/icons-material/ListOutlined";
import Logout from "@mui/icons-material/Logout";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Tooltip from "@mui/material/Tooltip";
import type { RefineThemedLayoutV2SiderProps } from "@refinedev/mui";
import {Simulate} from "react-dom/test-utils";
import {Divider, Menu, MenuList, Popover} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import {
    ContentCopyOutlined,
    ContentCut,
    ContentCutOutlined,
    CopyAllOutlined,
    DeleteOutlineOutlined,
    DifferenceOutlined,
    DriveFileMoveOutlined,
    DriveFileRenameOutlineOutlined,
    EnhancedEncryptionOutlined,
    FileOpen,
    FileOpenOutlined,
    FolderCopyOutlined,
    HistoryOutlined,
    InsertLinkOutlined,
    LaunchOutlined, Search, ShareOutlined,
    Sort,
    SortOutlined,
    StarBorderPurple500Outlined,
    Terminal,
    TerminalOutlined
} from "@mui/icons-material";
import {useKBar} from "@refinedev/kbar";

export const ThemedSiderV2: React.FC<RefineThemedLayoutV2SiderProps> = ({
  Title: TitleFromProps,
  render,
  meta,
  activeItemDisabled = false,
}) => {
  const {
    siderCollapsed,
    setSiderCollapsed,
    mobileSiderOpen,
    setMobileSiderOpen,
  } = useThemedLayoutContext();

  const drawerWidth = () => {
    if (siderCollapsed) return 56;
    return 240;
  };

  const t = useTranslate();
  const routerType = useRouterType();
  const Link = useLink();
  const { Link: LegacyLink } = useRouterContext();
  const ActiveLink = routerType === "legacy" ? LegacyLink : Link;
  const { hasDashboard } = useRefineContext();
  const translate = useTranslate();

  const { menuItems, selectedKey, defaultOpenKeys } = useMenu({ meta });

  const isExistAuthentication = useIsExistAuthentication();
  const TitleFromContext = useTitle();
  const authProvider = useActiveAuthProvider();
  const { warnWhen, setWarnWhen } = useWarnAboutChange();
  const { mutate: mutateLogout } = useLogout({
    v3LegacyAuthProviderCompatible: Boolean(authProvider?.isLegacy),
  });

  const [open, setOpen] = useState<{ [k: string]: any }>({});

    const [contextMenu, setContextMenu] = React.useState<{
        mouseX: number;
        mouseY: number;
    } | null>(null);

    const handleContextMenu = (event: React.MouseEvent) => {
        event.preventDefault();
        setContextMenu(
            contextMenu === null
                ? {
                    mouseX: event.clientX + 2,
                    mouseY: event.clientY - 6,
                }
                : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
                  // Other native context menus might behave different.
                  // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
                null,
        );
    };

    const handleClose = () => {
        setContextMenu(null);
    };



    React.useEffect(() => {
    setOpen((previous) => {
      const previousKeys: string[] = Object.keys(previous);
      const previousOpenKeys = previousKeys.filter((key) => previous[key]);

      const uniqueKeys = new Set([...previousOpenKeys, ...defaultOpenKeys]);
      const uniqueKeysRecord = Object.fromEntries(
        Array.from(uniqueKeys.values()).map((key) => [key, true])
      );
      return uniqueKeysRecord;
    });
  }, [defaultOpenKeys]);

  const RenderToTitle = TitleFromProps ?? TitleFromContext ?? DefaultTitle;

  const handleClick = (key: string) => {
    setOpen({ ...open, [key]: !open[key] });
  };

  const renderTreeView = (tree: ITreeMenu[], selectedKey?: string) => {
    return tree.map((item: ITreeMenu) => {
      const { icon, label, route, name, children, parentName, meta, options } =
        item;
      const isOpen = open[item.key || ""] || false;

      const isSelected = item.key === selectedKey;
      const isNested = !(
        pickNotDeprecated(meta?.parent, options?.parent, parentName) ===
        undefined
      );

      if (children.length > 0) {
        return (
          <CanAccess
            key={item.key}
            resource={name.toLowerCase()}
            action="list"
            params={{
              resource: item,
            }}
          >
            <div key={item.key}>
              <Tooltip
                title={label ?? name}
                placement="right"
                disableHoverListener={!siderCollapsed}
                arrow
              >
                <ListItemButton
                  onClick={() => {
                    if (siderCollapsed) {
                      setSiderCollapsed(false);
                      if (!isOpen) {
                        handleClick(item.key || "");
                      }
                    } else {
                      handleClick(item.key || "");
                    }
                  }}
                  sx={{
                    pl: isNested ? 4 : 2,
                    justifyContent: "center",
                    marginTop: "8px",
                  }}
                >
                  <ListItemIcon
                    sx={{
                      justifyContent: "center",
                      minWidth: "24px",
                      transition: "margin-right 0.3s",
                      marginRight: siderCollapsed ? "0px" : "12px",
                      color: "currentColor",
                    }}
                  >
                    {icon ?? <ListOutlined />}
                  </ListItemIcon>
                  <ListItemText
                    primary={label}
                    primaryTypographyProps={{
                      noWrap: true,
                      fontSize: "14px",
                    }}
                  />
                  {isOpen ? (
                    <ExpandLess
                      sx={{
                        color: "text.icon",
                      }}
                    />
                  ) : (
                    <ExpandMore
                      sx={{
                        color: "text.icon",
                      }}
                    />
                  )}
                </ListItemButton>
              </Tooltip>
              {!siderCollapsed && (
                <Collapse
                  in={open[item.key || ""]}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    {renderTreeView(children, selectedKey)}
                  </List>
                </Collapse>
              )}
            </div>
          </CanAccess>
        );
      }

      const linkStyle: CSSProperties =
        activeItemDisabled && isSelected ? { pointerEvents: "none" } : {};

      return (
        <CanAccess
          key={item.key}
          resource={name.toLowerCase()}
          action="list"
          params={{ resource: item }}
        >
          <Tooltip
            title={label ?? name}
            placement="right"
            disableHoverListener={!siderCollapsed}
            arrow
          >
            <ListItemButton
              component={ActiveLink}
              to={route}
              selected={isSelected}
              style={linkStyle}
              onClick={() => {
                setMobileSiderOpen(false);
              }}
              sx={{
                pl: isNested ? 4 : 2,
                py: isNested ? 1.25 : 1,
                justifyContent: "center",
                color: isSelected ? "primary.main" : "text.primary",
              }}
            >
              <ListItemIcon
                sx={{
                  justifyContent: "center",
                  transition: "margin-right 0.3s",
                  marginRight: siderCollapsed ? "0px" : "12px",
                  minWidth: "24px",
                  color: "currentColor",
                }}
              >
                {icon ?? <ListOutlined />}
              </ListItemIcon>
              <ListItemText
                primary={label}
                primaryTypographyProps={{
                  noWrap: true,
                  fontSize: "14px",
                }}
              />
            </ListItemButton>
          </Tooltip>
        </CanAccess>
      );
    });
  };

  const dashboard = hasDashboard ? (
    <CanAccess resource="dashboard" action="list">
      <Tooltip
        title={translate("dashboard.title", "Dashboard")}
        placement="right"
        disableHoverListener={!siderCollapsed}
        arrow
      >
        <ListItemButton
          component={ActiveLink}
          to="/"
          selected={selectedKey === "/"}
          onClick={() => {
            setMobileSiderOpen(false);
          }}
          sx={{
            pl: 2,
            py: 1,
            justifyContent: "center",
            color: selectedKey === "/" ? "primary.main" : "text.primary",
          }}
        >
          <ListItemIcon
            sx={{
              justifyContent: "center",
              minWidth: "24px",
              transition: "margin-right 0.3s",
              marginRight: siderCollapsed ? "0px" : "12px",
              color: "currentColor",
              fontSize: "14px",
            }}
          >
            <Dashboard />
          </ListItemIcon>
          <ListItemText
            primary={translate("dashboard.title", "Dashboard")}
            primaryTypographyProps={{
              noWrap: true,
              fontSize: "14px",
            }}
          />
        </ListItemButton>
      </Tooltip>
    </CanAccess>
  ) : null;

    const { query } = useKBar();

    const search = (
        <Tooltip
            title={t("buttons.search", "Search") + " Ctrl+K"}
            placement="right"
            disableHoverListener={!siderCollapsed}
            arrow
        >
            <ListItemButton
                key="search"
                onClick={query.toggle}
                sx={{
                    justifyContent: "center",
                }}
            >
                <ListItemIcon
                    sx={{
                        justifyContent: "center",
                        minWidth: "24px",
                        transition: "margin-right 0.3s",
                        marginRight: siderCollapsed ? "0px" : "12px",
                        color: "currentColor",
                    }}
                >
                    <Search />
                </ListItemIcon>
                <ListItemText
                    primary={t("buttons.search", "Search")}
                    secondary={"Ctrl+K"}
                    secondaryTypographyProps={{
                        noWrap: true,
                        fontSize: "10px",
                    }}
                    primaryTypographyProps={{
                        noWrap: true,
                        fontSize: "14px",
                    }}
                />
            </ListItemButton>
        </Tooltip>
    );

  const items = renderTreeView(menuItems, selectedKey);

  const renderSider = () => {
    if (render) {
      return render({
        dashboard,
        logout,
        items,
        collapsed: siderCollapsed,
      });
    }
    return (
      <>
          {search}
        {dashboard}
        {items}
      </>
    );
  };

  const drawer = (
    <List
      disablePadding
      sx={{
        flexGrow: 1,
        paddingTop: "16px",
      }}
    >
      {renderSider()}
    </List>
  );

  return (
    <div onContextMenu={handleContextMenu}>
      <Box
        sx={{
          width: { xs: drawerWidth() },
          display: {
            xs: "none",
            md: "block",
          },
          transition: "width 0.3s ease",
        }}
      />
      <Box
        component="nav"
        sx={{
          position: "fixed",
          zIndex: 1101,
          width: { sm: drawerWidth() },
          display: "flex",
        }}
      >
        <Drawer
          variant="temporary"
          elevation={2}
          open={mobileSiderOpen}
          onClose={() => setMobileSiderOpen(false)}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: {
              sm: "block",
              md: "none",
            },
          }}
        >
          <Box
            sx={{
              width: drawerWidth(),
            }}
          >
            <Box
              sx={{
                height: 64,
                display: "flex",
                alignItems: "center",
                paddingLeft: "16px",
                fontSize: "14px",
              }}
            >
              <RenderToTitle collapsed={false} />
            </Box>
            {drawer}
          </Box>
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              width: drawerWidth(),
              overflow: "hidden",
              transition: "width 200ms cubic-bezier(0.4, 0, 0.6, 1) 0ms",
            },
          }}
          open
        >
          <Paper
            elevation={0}
            sx={{
              fontSize: "14px",
              width: "100%",
              height: 64,
              display: "flex",
              flexShrink: 0,
              alignItems: "center",
              justifyContent: siderCollapsed ? "center" : "space-between",
              paddingLeft: siderCollapsed ? 0 : "16px",
              paddingRight: siderCollapsed ? 0 : "8px",
              variant: "outlined",
              borderRadius: 0,
              borderBottom: (theme) =>
                `1px solid ${theme.palette.action.focus}`,
            }}
          >
            <RenderToTitle collapsed={siderCollapsed} />
            {!siderCollapsed && (
              <IconButton size="small" onClick={() => setSiderCollapsed(true)}>
                {<ChevronLeft />}
              </IconButton>
            )}
          </Paper>
          <Box
            sx={{
              flexGrow: 1,
              overflowX: "hidden",
              overflowY: "auto",
            }}
          >
            {drawer}
          </Box>
        </Drawer>
      </Box>
        <Menu
            open={contextMenu !== null}
            anchorReference="anchorPosition"
            anchorPosition={
                contextMenu !== null
                    ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                    : undefined
            }
            anchorOrigin={{
                vertical: 'center',
                horizontal: 'center',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
            }}
        >
            <MenuList dense>
                <MenuItem onClick={handleClose}>
                    <ListItemText>New</ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                        <FileOpenOutlined fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Open with EvaNotebook</ListItemText>
                    <Typography variant="body2" color="text.secondary">
                    </Typography>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                        <FileOpenOutlined fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Open with</ListItemText>
                    <Typography variant="body2" color="text.secondary">
                    </Typography>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                        <ContentCut fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Cut</ListItemText>
                    <Typography variant="body2" color="text.secondary">
                    </Typography>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                        <ContentCopyOutlined fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Copy</ListItemText>
                    <Typography variant="body2" color="text.secondary">
                    </Typography>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                        <FolderCopyOutlined fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Copy Location</ListItemText>
                    <Typography variant="body2" color="text.secondary">
                    </Typography>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                        <FolderCopyOutlined fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Copy Name</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                        <CopyAllOutlined fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Duplicate Here</ListItemText>
                    <Typography variant="body2" color="text.secondary">
                    </Typography>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                        <DriveFileRenameOutlineOutlined fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Rename</ListItemText>
                    <Typography variant="body2" color="text.secondary">
                    </Typography>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                        <DeleteOutlineOutlined fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Move to Trash</ListItemText>
                    <Typography variant="body2" color="text.secondary">
                    </Typography>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                        <SortOutlined fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Sort by</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                        <StarBorderPurple500Outlined fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Add to Favorites</ListItemText>
                    <Typography variant="body2" color="text.secondary">
                    </Typography>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                        <InsertLinkOutlined fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Copy link</ListItemText>
                    <Typography variant="body2" color="text.secondary">
                    </Typography>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                        <ShareOutlined fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Share</ListItemText>
                    <Typography variant="body2" color="text.secondary">
                    </Typography>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                        <DriveFileMoveOutlined fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Move to</ListItemText>
                    <Typography variant="body2" color="text.secondary">
                    </Typography>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                        <LaunchOutlined fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Open in new tab</ListItemText>
                    <Typography variant="body2" color="text.secondary">
                    </Typography>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                        <DifferenceOutlined fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Compare with</ListItemText>
                    <Typography variant="body2" color="text.secondary">
                    </Typography>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleClose}>
                    <ListItemText>Properties</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <ListItemText>View mode</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                        <TerminalOutlined fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Open terminal here</ListItemText>
                    <Typography variant="body2" color="text.secondary">
                    </Typography>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                        <EnhancedEncryptionOutlined fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Sign & Encrypt</ListItemText>
                    <Typography variant="body2" color="text.secondary">
                    </Typography>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <ListItemText>Show additional information</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                        <HistoryOutlined fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Show History</ListItemText>
                    <Typography variant="body2" color="text.secondary">
                    </Typography>
                </MenuItem>
            </MenuList>
        </Menu>
    </div>
  );
};
