import React, { memo, useEffect, useState } from 'react';
import tw from 'twin.macro';
import isEqual from 'react-fast-compare';

interface RowProps {
    key?: any;
    r: any;
    playerName: string;
    score: string;
    time: any;
    header?: boolean;
}
function timeToHumanReadable (time: any): string {
    if (isNaN(time)) return time;
    time = Math.round(time);
    const seconds = time % 60;
    const minutes = Math.floor(time / 60);
    const hours = Math.floor(minutes / 60);

    return `${hours > 0 ? `${hours}:` : ''}${hours > 0 && minutes < 10 ? `0${minutes % 60}` : minutes % 60}:${seconds < 10 ? `0${seconds}` : seconds}`;
}

function isEven (n: any): boolean {
    if (isNaN(n)) return false;
    return n % 2 === 0;
}

const PlayerRow = ({ r, playerName, score, time, header }: RowProps) => {
    const [ timer, setTimer ] = useState(time);
    useEffect(() => {
        const interval = setInterval(() => {
            if (!isNaN(timer)) {
                setTimer(timer + 1);
            }
        }, 1000);
        return () => clearInterval(interval);
    });
    return (
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
            >{header ? time : <code>{timeToHumanReadable(timer)}</code>}
            </p>
        </div>
    );
};

export default memo(PlayerRow, isEqual);
