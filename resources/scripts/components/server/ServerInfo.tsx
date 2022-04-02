import React, { useEffect, useState } from 'react';
import tw, { TwStyle } from 'twin.macro';
import { faServer, faCircle, faMap, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SocketEvent, SocketRequest } from '@/components/server/events';
import TitledGreyBox from '@/components/elements/TitledGreyBox';
import PlayerRow from '@/components/elements/PlayerRow';
import PlayerList from '@/components/elements/PlayerList';
import { ServerContext } from '@/state/server';

interface Player {
    name: string;
    score: number;
    time: number;
}

interface ServerInfo {
    online: boolean;
    map: string;
    players: number;
    maxPlayers: number;
    playerList: Player[];
}
function visibleToColor (status: boolean): TwStyle {
    if (status) {
        return tw`text-green-500`;
    } else {
        return tw`text-red-500`;
    }
}

function playerIsConnecting (player: Player): boolean {
    return player.name === '';
}

const ServerInfoBlock = () => {
    const [ info, setInfo ] = useState<ServerInfo>({ online: false, map: '', players: 0, maxPlayers: 0, playerList: [] });
    const connected = ServerContext.useStoreState(state => state.socket.connected);
    const instance = ServerContext.useStoreState(state => state.socket.instance);
    const infoErrorer = (errorString : any = false) => {
        setInfo({
            online: false,
            map: errorString !== false ? errorString : '',
            players: 0,
            maxPlayers: 0,
            playerList: [],
        });
    };
    const infoListener = (data: string) => {
        let info: any = {};
        try {
            info = JSON.parse(data);
        } catch (e) {
            infoErrorer();
            return;
        }
        if (info.state !== true) {
            infoErrorer(info.Error);
            return;
        }
        const playerList: Player[] = [];
        if (info.players !== null) {
            for (const player of info.players) {
                playerList.push({
                    name: player.name,
                    score: player.score,
                    time: player.time,
                });
            }
            // sort the playerlist by score
            playerList.sort((a, b) => b.score - a.score);
        }
        setInfo({
            online: true,
            map: info.current_map || 'Unknown',
            players: info.player_count || 0,
            maxPlayers: info.max_players || 0,
            playerList: playerList || [],
        });
    };
    useEffect(() => {
        if (!connected || !instance) {
            return;
        }

        instance.addListener(SocketEvent.INFO, infoListener);
        instance.send(SocketRequest.SEND_INFO);

        return () => {
            instance.removeListener(SocketEvent.INFO, infoListener);
        };
    }, [ instance, connected ]);
    const online = info.online;
    const map = info.map;
    const players = info.players;
    const maxPlayers = info.maxPlayers;
    const playerList = info.playerList;
    const playerListElements = [];
    const status = ServerContext.useStoreState(state => state.status.value);
    let i = 1;
    for (const player of playerList) {
        playerListElements.push(<PlayerRow key={player.name} r={i} playerName={playerIsConnecting(player) ? 'Connecting' : player.name } score={player.score.toString()} time={player.time} />);
        i++;
    }
    if (status === 'running') {
        return (
            <TitledGreyBox css={tw`break-words mt-4`} title={'Server Info'} icon={faServer}>
                <div css={tw`flex`}>
                    <div css={tw`flex-alt-1 w-max overflow-ellipsis`}>
                        <p css={tw`text-xs uppercase`}>
                            <FontAwesomeIcon icon={faCircle} fixedWidth css={[ tw`mr-1`, visibleToColor(online) ]} />
                            &nbsp;{online ? 'Online' : 'Offline'}
                        </p>
                        <p css={tw`text-xs mt-2`}>
                            <FontAwesomeIcon icon={faMap} fixedWidth css={tw`mr-1`} />
                            <code css={tw`ml-1`}>{map}</code>
                        </p>
                        <p css={tw`text-xs mt-2`}>
                            <FontAwesomeIcon icon={faUsers} fixedWidth css={tw`mr-1`} /> {players}
                            <span css={tw`text-neutral-500`}> / {maxPlayers}</span>
                        </p>
                    </div>
                    <div css={tw`flex-alt-2 w-max`}>
                        <PlayerList>
                            <div css={tw`overflow-x-hidden overflow-y-scroll max-h-32 min-h-16`}>
                                {playerListElements.length > 0 ? playerListElements : <p css={tw`text-xs ml-1`}>No players online</p>}
                            </div>
                        </PlayerList>
                    </div>
                </div>
            </TitledGreyBox>
        );
    } else {
        return (
            <TitledGreyBox css={tw`break-words mt-4`} title={'Server Info'} icon={faServer}>
                <p css={tw`text-xs text-neutral-400 text-center p-3`}>
                    Server is {status !== null ? status : 'offline'}.
                </p>
            </TitledGreyBox>
        );
    }
};

export default ServerInfoBlock;
