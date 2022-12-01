import {Box, Typography} from '@mui/material';
import React, {ReactNode} from 'react';

type EmptyProps = {
    checkItems: Array<any> | Object | null | undefined;
    children: any;
    emptyContent?: ReactNode;
};

function hasData(items: Array<any> | Object | null | undefined) {
    if (items instanceof Array) {
        return items.length > 0;
    } else if (items instanceof Object) {
        return Object.keys(items).length > 0;
    } else {
        return !!items;
    }
}

export default function EmptyView(props: EmptyProps) {
    const text = props.emptyContent ?? 'No data';
    const x = hasData(props.checkItems);

    return (
        <React.Fragment>
            {!x && (
                <Box>
                    <Typography
                        sx={{fontSize: 12, textAlign: 'center'}}
                        color="text.secondary"
                        gutterBottom
                    >
                        {text}
                    </Typography>
                </Box>
            )}
            {x && props.children}
        </React.Fragment>
    );
}
