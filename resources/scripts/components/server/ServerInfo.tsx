import React, { useEffect, useState } from 'react';
import tw, { TwStyle } from 'twin.macro';
import { faServer, faCircle, faMap, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { formatIp } from '@/helpers';
import TitledGreyBox from '@/components/elements/TitledGreyBox';
import PlayerRow from '@/components/elements/PlayerRow';
import PlayerList from '@/components/elements/PlayerList';
import { ServerContext } from '@/state/server';

interface Player { // Each player in the playerlist will be an abstraction of this object
    name: string;
    score: number;
    time: string; // its normally a number, but we format it
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
function timeToHumanReadable (time: number): string {
    const seconds = time % 60;
    const minutes = Math.floor(time / 60);
    const hours = Math.floor(minutes / 60);

    return `${hours < 10 ? `0${hours}` : hours}:${minutes % 60 < 10 ? `0${minutes % 60}` : minutes % 60}:${seconds < 10 ? `0${seconds}` : seconds}`;
}

function playerIsConnecting (player: Player): boolean {
    return player.name === '';
}

const ServerInfoBlock = () => {
    const [ info, setInfo ] = useState<ServerInfo>({ online: false, map: '', players: 0, maxPlayers: 0, playerList: [] });

    const connected = ServerContext.useStoreState(state => state.socket.connected);
    const instance = ServerContext.useStoreState(state => state.socket.instance);
    // const infoErrorer = () => {
    //     setInfo({
    //         online: false,
    //         map: '',
    //         players: 0,
    //         maxPlayers: 0,
    //         playerList: [],
    //     });
    // };
    const infoListener = (data: any) => {
        // typescript please neck yourself
        let info: any = {};
        try {
            info = JSON.parse(data);
        } catch (e) {
            return;
        }

        // info is now an object containing server info pulled from Gamedig
        const playerList: Player[] = [];
        for (const player of info.players) {
            playerList.push({
                name: player.name,
                score: player.score,
                time: timeToHumanReadable(player.time),
            });
        }
        setInfo({
            online: true,
            map: info.map || 'Unknown',
            players: info.raw.numPlayers || 0,
            maxPlayers: info.maxplayers || 0,
            playerList: playerList || [],
        });
    };
    // const serverIP: string = ServerContext.useStoreState(state => state.server.data!.allocations.filter(alloc => alloc.isDefault).map(
    //     allocation => (allocation.alias || formatIp(allocation.ip))
    // ))[0];
    // const serverPort: number = ServerContext.useStoreState(state => state.server.data!.allocations.filter(alloc => alloc.isDefault).map(
    //     allocation => allocation.port
    // ))[0] || 27015;

    useEffect(() => {
        if (!connected || !instance) {
            return;
        }
        // Gamedig.query({
        //     type: 'tf2',
        //     // Ready for cancer?
        //     host: serverIP, // This fucking
        //     port: serverPort,
        // }).then(infoListener).catch(infoErrorer);
        //
        // We're going to load dummy data, seeing as Gamedig doesn't want to behave
        const data = {
            map: 'mge_triumph_beta5_rc2',
            raw: {
                numPlayers: 16,
            },
            maxplayers: 32,
            players: [
                {
                    name: 'Player 1',
                    score: 12,
                    time: 300,
                },
                {
                    name: 'Player 2',
                    score: 200,
                    time: 600,
                },
                {
                    name: 'Player 3',
                    score: 0,
                    time: 900,
                },
                {
                    name: 'Player 4',
                    score: 10,
                    time: 1200,
                },
                {
                    name: 'Player 5',
                    score: 69,
                    time: 1500,
                },
                {
                    name: 'Player 6',
                    score: 420,
                    time: 8625,
                },
                {
                    name: 'Player 7',
                    score: 1000,
                    time: 1161,
                },
                {
                    name: 'Player 8',
                    score: 9,
                    time: 66666,
                },
                {
                    name: 'Player 9',
                    score: 12,
                    time: 300,
                },
            ],
        };
        infoListener(JSON.stringify(data));
    }, [ instance, connected ]);
    const online = info.online;
    const map = info.map;
    const players = info.players;
    const maxPlayers = info.maxPlayers;
    const playerList = info.playerList;
    const playerListElements = [];
    for (const player of playerList) {
        playerListElements.push(<PlayerRow playerName={playerIsConnecting(player) ? 'Connecting' : player.name } score={player.score} time={player.time} />);
    }
    return (
        <TitledGreyBox css={tw`break-words mt-4`} title={'Server Info'} icon={faServer}>
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
            <PlayerList>
                <div css={tw`overflow-x-hidden overflow-y-scroll max-h-32 min-h-16`}>
                    {playerListElements.length > 0 ? playerListElements : <p css={tw`text-xs ml-1`}>No players online</p>}
                </div>
            </PlayerList>
        </TitledGreyBox>
    );
};

export default ServerInfoBlock;
