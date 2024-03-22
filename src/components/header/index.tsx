import {Autocomplete, Button, Chip, IconButton, Popover, TextField} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import React, {useContext} from "react";
import {Comment, Edit, HistoryOutlined, MoreHoriz} from "@mui/icons-material";
import {ProvisionContext} from "../../contexts/provision";
import {useThemedLayoutContext} from "../layout/useThemedLayoutContext";
import {HamburgerMenu} from "../layout/hamburgerMenu";
import {GlobalBreadcrumb} from "./globalBreadcrumb";
import Select from "@mui/material/Select";
import {useForm} from "@refinedev/react-hook-form";
import {Controller, SubmitHandler} from "react-hook-form";
import {supabaseClient} from "../../utility";
import {useNotification, useResource} from "@refinedev/core";

const SharePermissions = ({closePopover}: {closePopover: () => void}) => {
    const {
        control,
        register,
        handleSubmit
    } = useForm<any>();
    const {resource} = useResource();
    const {open} = useNotification();

    const onSubmit: SubmitHandler<any> = async (formValues) => {
        if (!open)
            return;
        const { error } = await supabaseClient.rpc('store_permissions', {
            ...formValues,
            resource_id: resource?.name
        });
        if (error) {
            open({
                type: "error",
                message: error.details
            });
        }
        open({
            type: "success",
            message: "The invitations have been sent!"
        });
        closePopover();
    }

    return (
        <Stack sx={
            {
                p: '1em',
                width: '30vw'
            }
        }>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    name="people"
                    control={control}
                    rules={{ required: 'People selection is required' }}
                    render={({ field, fieldState }) => (
                        <Autocomplete
                            multiple
                            options={[]}
                            freeSolo
                            fullWidth
                            onChange={(_, data) => field.onChange(data)}
                            renderTags={(value: readonly string[], getTagProps) =>
                                value.map((option: string, index: number) => (
                                    <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                                ))
                            }
                            renderInput={(params) => (
                                <TextField {...params}
                                           variant="filled" label="People" placeholder="Add people"
                                           error={!!fieldState.error}
                                           helperText={fieldState.error?.message}
                                />
                            )}
                        />
                    )}
                />
                <Select
                    {...register("permission", { required: true })}
                    name="permission"
                    fullWidth
                    defaultValue={'can_view'}
                    label="Permission"
                >
                    <MenuItem value={'*'}>Full Access</MenuItem>
                    <MenuItem value={'can_edit'}>Can Edit</MenuItem>
                    <MenuItem value={'can_input'}>Can Input</MenuItem>
                    <MenuItem value={'can_comment'}>Can Comment</MenuItem>
                    <MenuItem value={'can_view'}>Can View</MenuItem>
                </Select>
                <Button type="submit">Invite</Button>
            </form>
        </Stack>
    );
}


export const Header = () => {
    const [sharePopover, setSharePopover] = React.useState<HTMLLIElement | null>(null);

    const sharePage = (event: React.MouseEvent<HTMLLIElement>) => {
        setSharePopover(event.currentTarget);
    };

    const closeSharePopover = () => {
        setSharePopover(null);
    };

    const showSharePopover = Boolean(sharePopover);
    const idSharePopover = showSharePopover ? 'share-popover' : undefined;

    const {toolbarWidgets} = useContext(ProvisionContext);

    const {
        setRightSiderWidget
    } = useThemedLayoutContext();

    return (<>
        <Toolbar variant="dense">
            <Stack direction="row" width="100%" alignItems="center">
                <HamburgerMenu/>
                <Stack direction="row"
                       width="100%"
                       justifyContent="flex-start"
                       alignItems="center"
                       id="header-flex-start"
                >
                    <GlobalBreadcrumb/>
                </Stack>
                <Stack
                    direction="row"
                    width="100%"
                    justifyContent="flex-end"
                    alignItems="center"
                    id="header-flex-end"
                >
                    {toolbarWidgets.map((toolbarWidget, index) => <MenuItem key={toolbarWidget.label}
                                                                            onClick={() => {
                                                                                setRightSiderWidget(toolbarWidget.component)
                                                                            }}
                                                                            aria-label={`toolbar-widget-${toolbarWidget.label}`}>{toolbarWidget.label}</MenuItem>)}
                    <MenuItem aria-describedby={idSharePopover} onClick={sharePage} aria-label="share-resource">Share</MenuItem>
                    <IconButton aria-label="resource-history" disabled color="primary" size="small">
                        <HistoryOutlined/>
                    </IconButton>
                    <IconButton aria-label="resource-comments" disabled color="primary" size="small">
                        <Comment/>
                    </IconButton>
                    <IconButton aria-label="more-options" disabled color="primary" size="small">
                        <MoreHoriz/>
                    </IconButton>
                </Stack>
            </Stack>
            <Popover
                id={idSharePopover}
                open={showSharePopover}
                anchorEl={sharePopover}
                onClose={closeSharePopover}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <SharePermissions closePopover={closeSharePopover}></SharePermissions>
            </Popover>
        </Toolbar>
    </>);
};
