import { mount } from "@vue/test-utils";
import WordleBoard from "../WordleBoard.vue";
import { VICTORY_MESSAGE, DEFEAT_MESSAGE, WORD_SIZE } from "@/settings";

describe("WordleBoard", () => {
  const wordOfTheDay = "TESTS";
  let wrapper: ReturnType<typeof mount>;

  beforeEach(() => {
    wrapper = mount(WordleBoard, { props: { wordOfTheDay } });
  });

  async function playerSubmitsGuess(guess: string) {
    const guessInput = wrapper.find("input[type=text]");
    await guessInput.setValue(guess);
    await guessInput.trigger("keydown.enter");
  }

  describe("End of the game messages", () => {
    test("When the user make a guess that matches the word of the day, then a victory message appears", async () => {
      await playerSubmitsGuess(wordOfTheDay);

      expect(wrapper.text()).toContain(VICTORY_MESSAGE);
    });

    describe.each([
      { numberOfGuesses: 0, shouldSeeDefeatMessage: false },
      { numberOfGuesses: 1, shouldSeeDefeatMessage: false },
      { numberOfGuesses: 2, shouldSeeDefeatMessage: false },
      { numberOfGuesses: 3, shouldSeeDefeatMessage: false },
      { numberOfGuesses: 4, shouldSeeDefeatMessage: false },
      { numberOfGuesses: 5, shouldSeeDefeatMessage: false },
      { numberOfGuesses: 6, shouldSeeDefeatMessage: true },
    ])(
      "a defeat message should appear if the player makes incorrect guesses 6 times in a row",
      ({ numberOfGuesses, shouldSeeDefeatMessage }) => {
        test(`therefore for ${numberOfGuesses} guess(es), a defeat message should ${
          shouldSeeDefeatMessage ? "" : "not"
        } appear`, async () => {
          for (let i = 0; i < numberOfGuesses; i++) {
            await playerSubmitsGuess("WRONG");
          }

          if (shouldSeeDefeatMessage) {
            expect(wrapper.text()).toContain(DEFEAT_MESSAGE);
          } else {
            expect(wrapper.text()).not.toContain(DEFEAT_MESSAGE);
          }
        });
      }
    );

    test("If the user has not yet made a guess, then no end-of-game message appears", async () => {
      expect(wrapper.text()).not.toContain(VICTORY_MESSAGE);
      expect(wrapper.text()).not.toContain(DEFEAT_MESSAGE);
    });
  });

  describe("Rules for defining the word of the day", () => {
    beforeEach(() => {
      console.warn = vi.fn();
    });

    test.each([
      { wordOfTheDay: "FLY", reason: "word-of-the-day must have 5 characters" },
      {
        wordOfTheDay: "test",
        reason: "word-of-the-day must be all in uppercase",
      },
      {
        wordOfTheDay: "QWERT",
        reason: "word-of-the-day must be a valid English word",
      },
    ])(
      "Since $reason: $wordOfTheDay is invalid, therefore a warning must be emitted",
      async (testCase) => {
        mount(WordleBoard, { props: { wordOfTheDay: testCase.wordOfTheDay } });

        expect(console.warn).toHaveBeenCalled();
      }
    );

    test("No warning is emitted if the word of the day provided is a real uppercase English word with 5 characters", async () => {
      mount(WordleBoard, { props: { wordOfTheDay: "TEST" } });

      expect(console.warn).not.toHaveBeenCalled;
    });
  });

  describe("Player input", () => {
    test("remains in focus the entire time", async () => {
      document.body.innerHTML = `<div id="app"></div>`;
      wrapper = mount(WordleBoard, {
        props: { wordOfTheDay },
        attachTo: "#app",
      });

      expect(
        wrapper.find("input[type=text]").attributes("autofocus")
      ).not.toBeUndefined();

      await wrapper.find("input[type=text]").trigger("blur");
      expect(document.activeElement).toBe(
        wrapper.find("input[type=text]").element
      );
    });
    test(`Player guesses are limited to ${WORD_SIZE} letters`, async () => {
      await playerSubmitsGuess(wordOfTheDay + "EXTRA");

      expect(wrapper.text()).toContain(VICTORY_MESSAGE);
    });
    test.todo(
      "Player guesses can only be submitted if they are real words",
      async () => {
        await playerSubmitsGuess("QWERT");

        expect(wrapper.text()).not.toContain(VICTORY_MESSAGE);
        expect(wrapper.text()).not.toContain(DEFEAT_MESSAGE);
      }
    );
    test("Player guesses are not case-sensitive", async () => {
      await playerSubmitsGuess(wordOfTheDay.toLowerCase());

      expect(wrapper.text()).toContain(VICTORY_MESSAGE);
    });
    test("Player guesses can only contain letters", async () => {
      await playerSubmitsGuess("H3!RT");

      expect(
        wrapper.find<HTMLInputElement>("input[type=text]").element.value
      ).toEqual("HRT");
    });
    test.skip("Non-letter characters do not render on the screen while being typed", async () => {
      await playerSubmitsGuess("12");
      await playerSubmitsGuess("123");

      expect(
        wrapper.find<HTMLInputElement>("input[type=text]").element.value
      ).toEqual("");
    });
  });
});
