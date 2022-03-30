import React, { memo } from 'react';
// no icons
import tw from 'twin.macro';
import PlayerRow from '@/components/elements/PlayerRow';
import isEqual from 'react-fast-compare'; // ????? how can you be faster than a === b ?

interface ListProps {
    containerClass?: string;
    children: React.ReactNode;
    // come back to this
}

const PlayerList = ({ containerClass, children }: ListProps) => (
    <div css={tw`bg-neutral-900 overflow-hidden max-h-40 mx-2 mb-0`} className={containerClass}>
        <PlayerRow r={'header'} playerName={'PLAYERS'} score={'SCORE'} time={'TIME'} header></PlayerRow>
        {children}
    </div>
);

export default memo(PlayerList, isEqual);
