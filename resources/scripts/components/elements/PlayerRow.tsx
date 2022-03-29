import React, { memo } from 'react';
// no icons
import tw from 'twin.macro';
import isEqual from 'react-fast-compare'; // ????? how can you be faster than a === b ?

interface RowProps {
    key?: any;
    playerName: string;
    score: number;
    time: string;
}

const PlayerRow = ({ key, playerName, score, time }: RowProps) => (
    <div id={key} css={tw`py-0.5 px-1 text-neutral-300 flex flex-row flex-nowrap justify-between content-start items-start gap-y-0.5 gap-x-2 w-full`}>
        <p css={tw`text-xs flex-l max-w-name overflow-ellipsis text-left overflow-hidden whitespace-nowrap max-h-4`}>{playerName}</p>
        <p css={tw`text-xs flex-m text-center max-h-4`}>{score}</p>
        <p css={tw`text-xs flex-r text-right`}><code>{time}</code></p>
    </div>
);

export default memo(PlayerRow, isEqual);
