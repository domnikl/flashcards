import {CircularProgress} from '@mui/material';
import React from 'react';

type IsFetchingProps = {
    isFetching: boolean;
    error?: null | { message: string };
    children: any;
};

export default function IsLoading(props: IsFetchingProps) {
    if (props.error) {
        return props.error?.message;
    }

    return props.isFetching ? <CircularProgress/> : props.children;
}
