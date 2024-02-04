import {IResourceComponentsProps, useGetIdentity} from "@refinedev/core";
import "@blocknote/react/style.css";
import {ChangeEvent, useContext, useEffect, useRef} from "react";
import {ColorModeContext} from "../../contexts/color-mode";
import {useQuery} from "../../utility/useQuery";

import {TextareaAutosize as BaseTextareaAutosize} from '@mui/base/TextareaAutosize';
import {styled} from '@mui/system';
import {ProvisionContext} from "../../contexts/provision";

export default function UnstyledTextareaIntroduction() {
    return <TextareaAutosize aria-label="empty textarea" placeholder="Empty" />;
}

const blue = {
    100: '#DAECFF',
    200: '#b6daff',
    400: '#3399FF',
    500: '#007FFF',
    600: '#0072E5',
    900: '#003A75',
};

const grey = {
    50: '#F3F6F9',
    100: '#E5EAF2',
    200: '#DAE2ED',
    300: '#C7D0DD',
    400: '#B0B8C4',
    500: '#9DA8B7',
    600: '#6B7A90',
    700: '#434D5B',
    800: '#303740',
    900: '#1C2025',
};

const TextareaAutosize = styled(BaseTextareaAutosize)(
    ({ theme }) => `
  box-sizing: border-box;
  width: 320px;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  padding: 8px 12px;
  width: 100%;
  border-radius: 8px;
  color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
  box-shadow: 0px 2px 2px ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};

  &:hover {
    border-color: ${blue[400]};
  }

  &:focus {
    border-color: ${blue[400]};
    box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? blue[600] : blue[200]};
  }

  // firefox
  &:focus-visible {
    outline: 0;
  }
`,
);



export const TextEditor: React.FC<IResourceComponentsProps> = () => {
    const {data: identity} = useGetIdentity<any>();
    const url = useQuery();
    const uri = new URL(url.get("uri") ?? "browser:/tmp/getting-started.txt");
    const {filesystem: fs} = useContext(ProvisionContext);
    const inputRef = useRef<HTMLTextAreaElement|null>(null);

    useEffect(() => {
        if (!fs || !inputRef?.current)
            return;
        inputRef.current.value = fs.readFileSync(uri.pathname, 'utf-8');
    }, [fs, inputRef?.current, uri.pathname]);

    function onChange(event: ChangeEvent<HTMLTextAreaElement>) {
        if (!inputRef?.current)
            return;
        fs.writeFileSync(uri.pathname, inputRef.current.value);
    }

    if (!identity && !identity?.color)
        return <>Loading</>;

    return <TextareaAutosize  onChange={onChange} ref={inputRef}></TextareaAutosize>;
};