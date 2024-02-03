import { mount } from "@vue/test-utils";
import WordleBoard from "../WordleBoard.vue";
import { VICTORY_MESSAGE, DEFEAT_MESSAGE } from "@/settings";

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

    test("If the user makes a guess that is incorrect, then a defeat message appears", async () => {
      await playerSubmitsGuess("WRONG");

      expect(wrapper.text()).toContain(DEFEAT_MESSAGE);
    });

    test("If the user has not yet made a guess, then no end-of-game message appears", async () => {
      expect(wrapper.text()).not.toContain(VICTORY_MESSAGE);
      expect(wrapper.text()).not.toContain(DEFEAT_MESSAGE);
    });
  });

  describe("Rules for defining the word of the day", () => {
    test.each(["FLY", "tests", "QWERT"])(
      "If '%s' provided, a warning is emitted",
      async (wordOfTheDay) => {
        console.warn = vi.fn();

        mount(WordleBoard, { props: { wordOfTheDay: wordOfTheDay } });

        expect(console.warn).toHaveBeenCalled();
      }
    );

    test("No warning is emitted if the word of the day provided is a real uppercase English word with 5 characters", async () => {
      console.warn = vi.fn();

      mount(WordleBoard, { props: { wordOfTheDay: "TEST" } });

      expect(console.warn).not.toHaveBeenCalled;
    });
  });

  describe("Player input", () => {
    test.todo("Player guesses are limited to 5 letters");
    test.todo("Player guesses can only be submitted if they are real words");
    test.todo("Player guesses are not case-sensitive");
    test.todo("Player guesses can only contain letters");
  });
});
