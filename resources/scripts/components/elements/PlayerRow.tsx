import React, { memo } from 'react';
// no icons
import tw from 'twin.macro';
import isEqual from 'react-fast-compare'; // ????? how can you be faster than a === b ?

interface RowProps {
    key?: any;
    r: any;
    playerName: string;
    score: string;
    time: string;
    header?: boolean;
}

function isEven (n: any): boolean {
    // if n isn't a number, return false
    if (isNaN(n)) return false;
    return n % 2 === 0;
}

const PlayerRow = ({ r, playerName, score, time, header }: RowProps) => (
    <div id={r} css={[
        tw`py-0.5 px-1 text-neutral-300 flex flex-row flex-nowrap justify-between content-start items-start gap-y-0.5 gap-x-2 w-full`,
        header ? tw`pr-5 border-b border-neutral-800 border-solid` : tw`pr-1`,
        isEven(r) ? tw`bg-neutral-800` : tw`bg-neutral-900`,
    ]}
    >
        <p css={[
            tw`flex-l max-w-md overflow-ellipsis text-left overflow-hidden whitespace-nowrap max-h-4`,
            header ? tw`font-bold text-sm` : tw`text-xs`,
        ]}
        >{playerName}
        </p>
        <p css={[
            tw`text-xs flex-m text-center max-h-4`,
            header ? tw`font-bold text-sm` : tw`text-xs`,
        ]}
        >{score}
        </p>
        <p css={[
            tw`text-xs flex-r text-right`,
            header ? tw`font-bold text-sm` : tw`text-xs`,
        ]}
        >{header ? time : <code>{time}</code>}
        </p>
    </div>
);

export default memo(PlayerRow, isEqual);
