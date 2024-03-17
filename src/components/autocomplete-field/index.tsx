import React from 'react';
import { useAutocomplete } from '@refinedev/mui';
import { Autocomplete, TextField } from '@mui/material';
import {Controller, useFormContext} from "react-hook-form";

// Define the props interface for better type checking and readability
interface ReferenceAutocompleteInputProps {
    resource: string; // Resource to fetch from (e.g., 'authors', 'categories')
    source: string; // Field name in the form (e.g., 'author_id', 'category_id')
    label: string; // Label for the input field
    rules?: any; // Validation rules for react-hook-form
    control?: any;
    errors?: any;
}

const ReferenceAutocompleteInput: React.FC<ReferenceAutocompleteInputProps> = ({ control, errors, resource, source, label, rules }) => {
    const { autocompleteProps } = useAutocomplete({
        resource: resource,
    });

    return (
        <Controller
            control={control}
            name={source}
            rules={rules}
            render={({ field }) => (
                <Autocomplete
                    {...autocompleteProps}
                    {...field}
                    getOptionKey={(option) => option.name}
                    getOptionLabel={(option) => option.name}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label={label}
                            error={!!errors[source]}
                            helperText={errors[source]?.message}
                            required={rules?.required}
                        />
                    )}
                />
            )}
        />
    );
};

export default ReferenceAutocompleteInput;