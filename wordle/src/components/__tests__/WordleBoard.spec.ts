import { mount } from "@vue/test-utils";
import WordleBoard from "../WordleBoard.vue";
import { VICTORY_MESSAGE, DEFEAT_MESSAGE } from "@/settings";

describe("WordleBoard", () => {
  const wordOfTheDay = "TESTS";

  test("When the user make a guess that matches the word of the day, then a victory message appears", async () => {
    const wrapper = mount(WordleBoard, { props: { wordOfTheDay } });

    const guessInput = wrapper.find("input[type=text]");
    await guessInput.setValue(wordOfTheDay);
    await guessInput.trigger("keydown.enter");

    expect(wrapper.text()).toContain(VICTORY_MESSAGE);
  });

  test("If the user makes a guess that is incorrect, then a defeat message appears", async () => {
    const wrapper = mount(WordleBoard, { props: { wordOfTheDay } });

    const guessInput = wrapper.find("input[type=text]");
    await guessInput.setValue("WRONG");
    await guessInput.trigger("keydown.enter");

    expect(wrapper.text()).toContain(DEFEAT_MESSAGE);
  });

  test("If the user has not yet made a guess, then no end-of-game message appears", async () => {
    const wrapper = mount(WordleBoard, { props: { wordOfTheDay } });

    expect(wrapper.text()).not.toContain(VICTORY_MESSAGE);
    expect(wrapper.text()).not.toContain(DEFEAT_MESSAGE);
  });
});
