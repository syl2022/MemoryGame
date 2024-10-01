import {declareWinner, initializeGame, players, scores} from '../index';

describe('Schmemory Game', () => {
    // Setup mock DOM elements before each test
    beforeEach(() => {
        document.body.innerHTML = `
      <div id="playerSetup"></div>
      <section id="game" aria-live="polite" style="display:none;">
        <header id="currentPlayer" aria-live="polite">Current Player: Player 1</header>
        <header id="scoreboard" aria-live="polite"><p>00</p></header>
        <section id="game-grid" role="grid" aria-label="Game grid" aria-live="polite"></section>
       </section>`;
    });
    test('declare the winner based on score', () => {

        initializeGame(2);

        scores[0] = 30; // Player 1
        scores[1] = 20; // Player 2

        const mockAlert = jest.spyOn(window, 'alert').mockImplementation(() => {
        });

        declareWinner();

        expect(mockAlert).toHaveBeenCalledWith('Player 1 wins with a score of 30!');
        mockAlert.mockRestore();
    });
});