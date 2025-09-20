import React, { useState, useEffect } from 'react';
import { FormTitleContent } from '../../SignupFormStyles';
import { Heading, Paragraph} from '../../../../Elements';
import { GrayCard, SearchSelectWrappper, SearchWrapper, SuggestionList } from './StudentPersonalInformation';
import { Grid } from '@mui/material';
import Searchbar from '../../../../Elements/Searchbar/Searchbar';
import { fetchData } from '../../../../../../utils/apiUtils';
import { getApiConfig } from '../../../../../../api';

interface Board {
    id: number;
    name: string;
}

interface ApiBoard {
    boardId: number;
    boardName: string;
}

interface BoardProps {
    initialData?: {
        boardId?: number | null;
    };
    onDataChange: (boardId: number) => void;
}

const Board: React.FC<BoardProps> = ({ initialData = {}, onDataChange }) => {
    const [boards, setBoards] = useState<Board[]>([]);
    const [selectedBoardId, setSelectedBoardId] = useState<number | null>(initialData.boardId || null);
    const [query, setQuery] = useState<string>('');
    const [suggestions, setSuggestions] = useState<Board[]>([]);

    useEffect(() => {
        const fetchBoards = async () => {
            try {
                const apiConfig = getApiConfig('boards');
                const result = await fetchData(apiConfig.url, apiConfig.method);

                const data = result.data as ApiBoard[];

                console.log('Board API response:', data);

                if (Array.isArray(data)) {
                    const formattedBoards: Board[] = data.map((b) => ({
                        id: b.boardId,
                        name: b.boardName
                    }));
                    setBoards(formattedBoards);
                }
            } catch (error) {
                console.error('Error fetching boards:', error);
            }
        };

        fetchBoards();
    }, []);

    useEffect(() => {
        if (onDataChange && selectedBoardId) {
            onDataChange(selectedBoardId); // ✅ return only boardId
        }
    }, [selectedBoardId, onDataChange]);

    const handleBoard = (board: Board) => {
        setSelectedBoardId(board.id);
        setQuery(board.name);
        setSuggestions([]);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);
        const filtered = boards.filter((b) =>
            b.name.toLowerCase().includes(value.toLowerCase())
        );
        setSuggestions(filtered);
    };

    return (
        <div>
            {/* Form_title_content::Start */}
            <div>
                <FormTitleContent>
                 <Heading as="h2" variant="h5" weight="semibold">
                       Select your board
                    </Heading>
                    <Paragraph variant="p">
                        With your AI Teacher, every lesson is tailored just for you. Log in to explore, learn, and grow at your own pace.
                    </Paragraph>
                   
                </FormTitleContent>
            </div>
            {/* Form_title_content::End */}

            {/* All_boards_Content::Start */}
            <div>
                <Grid container spacing={3}>
                    {boards.map((board) => (
                        <Grid key={board.id} size={{ xs: 12, sm: 6, md: 4, lg: 4 }}>
                            <GrayCard
                                onClick={() => handleBoard(board)}
                                $active={selectedBoardId === board.id}
                            >
                                <Paragraph variant="p">
                                    {board.name}
                                </Paragraph>
                            </GrayCard>
                        </Grid>
                    ))}
                </Grid>
            </div>
            {/* All_boards_Content::End */}

            {/* All_boards_search_select::Start */}
            <SearchSelectWrappper>
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12 }}>
                        <SearchWrapper>
                            <Searchbar
                                value={query}
                                onChange={handleChange}
                                placeholder="Find other boards" />
                            {query && suggestions.length > 0 && (
                                <SuggestionList>
                                    {suggestions.map((item) => (
                                        <li key={item.id} onClick={() => handleBoard(item)}>
                                            {item.name}
                                        </li>
                                    ))}
                                </SuggestionList>
                            )}
                        </SearchWrapper>
                    </Grid>
                </Grid>
            </SearchSelectWrappper>
            {/* All_boards_search_select::End */}
        </div>
    );
};

export default Board;
