import { mount } from "@vue/test-utils";
import WordleBoard from "../WordleBoard.vue";
import { VICTORY_MESSAGE, DEFEAT_MESSAGE } from "@/settings";

describe("WordleBoard", () => {
  const wordOfTheDay = "TESTS";
  let wrapper: ReturnType<typeof mount>;

  beforeEach(()=>{
    wrapper = mount(WordleBoard, { props: { wordOfTheDay } });
  })

  async function playerSubmitsGuess(guess: string){
    const guessInput = wrapper.find("input[type=text]");
    await guessInput.setValue(guess);
    await guessInput.trigger("keydown.enter");
  }

  test("When the user make a guess that matches the word of the day, then a victory message appears", async () => {
    await playerSubmitsGuess(wordOfTheDay)

    expect(wrapper.text()).toContain(VICTORY_MESSAGE);
  });

  test("If the user makes a guess that is incorrect, then a defeat message appears", async () => {
    await playerSubmitsGuess("WRONG")

    expect(wrapper.text()).toContain(DEFEAT_MESSAGE);
  });

  test("If the user has not yet made a guess, then no end-of-game message appears", async () => {
    expect(wrapper.text()).not.toContain(VICTORY_MESSAGE);
    expect(wrapper.text()).not.toContain(DEFEAT_MESSAGE);
  });
});
