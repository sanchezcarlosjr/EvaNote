import {IResourceComponentsProps} from "@refinedev/core";
import {Box, TextField} from "@mui/material";
import {Create} from "@refinedev/mui";
import {useForm} from "@refinedev/react-hook-form";
import Typography from "@mui/material/Typography";
import {useQuery} from "../../utility/useQuery";
import {useEffect} from "react";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";


export const DirectoryCreate: React.FC<IResourceComponentsProps> = () => {
    const params = useQuery();
    const parent = params.get('parent') ?? "";

    const {
        reset,
        refineCore: {formLoading}, saveButtonProps, register, setValue, formState: {errors},
    } = useForm<any, any, any, any>({
        refineCoreProps: {
            resource: "resources", redirect: false, onMutationSuccess: () => {
                setValue('name', crypto.randomUUID());
            }
        }
    });

    useEffect(() => {
        reset({
            name: crypto.randomUUID(),
            meta: {
                parent,
                'content-type': 'nb'
            }
        });
    }, [parent]);

    const checkKeyDown = (e: any) => {
        if (e.key === 'Enter') saveButtonProps.onClick(e);
    };

    return (<Create
            title={<Typography variant="h5" gutterBottom>Create resource</Typography>}
            isLoading={formLoading}
            breadcrumb={null}
            saveButtonProps={saveButtonProps}
        >
            <Box
                component="form"
                sx={{display: "flex", flexDirection: "column"}}
                autoComplete="off"
            >
                <TextField
                    {...register("meta.label", {
                        required: "This field is required",
                    })}
                    error={!!errors.label}
                    helperText={errors.label?.message as string}
                    margin="normal"
                    fullWidth
                    label="Label"
                    name="meta.label"
                    autoFocus
                    onKeyDown={(e) => checkKeyDown(e)}
                />
                <Select
                    {...register("meta.content-type")}
                    fullWidth
                    label="Content Type"
                    defaultValue={'nb'}
                    name="meta.content-type"
                >
                    <MenuItem value={'nb'}>EvaNotebook</MenuItem>
                    <MenuItem value={'inode/directory'}>Directory</MenuItem>
                </Select>
                <TextField
                    {...register("meta.uri")}
                    error={!!errors.label}
                    helperText={errors.label?.message as string}
                    margin="normal"
                    fullWidth
                    label="URI"
                    name="meta.uri"
                    onKeyDown={(e) => checkKeyDown(e)}
                />
                {parent && <TextField
                    {...register("meta.parent")}
                    margin="normal"
                    fullWidth
                    label="Parent"
                    name="meta.parent"
                    disabled
                />}
                <TextField
                    {...register("name")}
                    margin="normal"
                    fullWidth
                    label="Name"
                    name="name"
                    disabled
                />
            </Box>
        </Create>);
};
