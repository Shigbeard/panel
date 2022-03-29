import React, { memo } from 'react';
// no icons
import tw from 'twin.macro';
import isEqual from 'react-fast-compare'; // ????? how can you be faster than a === b ?

interface ListProps {
    containerClass?: string;
    headerClass?: string;
    children: React.ReactNode;
    // come back to this
}

const PlayerList = ({ containerClass, headerClass, children }: ListProps) => (
    <div css={tw`mt-2 bg-neutral-900 overflow-hidden max-h-40 mx-2 mb-0`} className={containerClass}>
        <div css={tw`py-0.5 pl-1 pr-5 text-neutral-300 font-bold flex flex-row flex-nowrap justify-between content-start items-start gap-y-0.5 gap-x-2 w-full`} className={headerClass}>
            <p css={tw`text-sm flex-l max-w-name overflow-ellipsis text-left overflow-hidden whitespace-nowrap max-h-4 uppercase`}>PLAYERS</p>
            <p css={tw`text-sm flex-m text-center max-h-4 uppercase`}>SCORE</p>
            <p css={tw`text-sm flex-r text-right uppercase`}>TIME</p>
        </div>
        {children}
    </div>
);

export default memo(PlayerList, isEqual);
