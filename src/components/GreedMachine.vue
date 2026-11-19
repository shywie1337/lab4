<!--
  GreedMachine — обгортка з візуалом ігрового автомата "Greed".

  Як користуватися:
  У слот потрібно передати РІВНО ТРИ елементи-барабани (сотні, десятки, одиниці).
  Для цього підходить компонент countdown з daisyUI. Компонент сам оформлює
  кожен елемент слота як окрему плашку, тому додаткові стилі для плашок не потрібні.

  Важливо: countdown у daisyUI працює лише до 99(за умовчанням), тому число (0–999)
  треба розбити на три цифри самостійно перед відправкою в компонент

  Приклад:
    <GreedMachine>
      <span class="countdown">
        <span :style="{ '--value': hundreds, '--digits': 1 }">{{ hundreds }}</span>
      </span>
      <span class="countdown">
        <span :style="{ '--value': tens, '--digits': 1 }">{{ tens }}</span>
      </span>
      <span class="countdown">
        <span :style="{ '--value': units, '--digits': 1 }">{{ units }}</span>
      </span>
    </GreedMachine>
-->

<template>
  <div class="greed-machine">
    <!-- Вивіска автомата -->
    <div class="gm-sign">
      <span>GREED</span>
    </div>

    <!-- Основний корпус -->
    <div class="gm-body">
      <!-- Дерев'яна верхня частина -->
      <div class="gm-wood-casing">
        <!-- Темний екран-заглиблення -->
        <div class="gm-screen">
          <!-- Лічильник: сюди потрапляють три барабани, передані у слот -->
          <div class="gm-counter">
            <slot />
          </div>

          <!-- Монетоприймач -->
          <div class="gm-coin-area">
            <div class="gm-coin-slot"></div>
          </div>
        </div>
      </div>

      <!-- Кам'яна/залізна основа -->
      <div class="gm-base">
        <div class="gm-base-detail"></div>
      </div>
    </div>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');
</style>

<style scoped>
.greed-machine {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 260px;
  font-family: 'VT323', monospace;
  filter: drop-shadow(0 15px 15px rgba(0, 0, 0, 0.4));
}

.gm-sign {
  background-color: #534c50;
  border: 4px solid #000;
  border-radius: 8px 8px 0 0;
  padding: 10px 20px;
  margin-bottom: -4px;
  z-index: 2;
  box-shadow:
    inset 0 -4px 0 rgba(0, 0, 0, 0.3),
    inset 0 4px 0 rgba(255, 255, 255, 0.1);
}

.gm-sign span {
  color: #2b2529;
  font-size: 32px;
  font-weight: bold;
  letter-spacing: 2px;
}

.gm-body {
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
}

.gm-wood-casing {
  background-color: #a37b5b;
  border: 4px solid #000;
  border-bottom: none;
  border-radius: 12px 12px 0 0;
  padding: 20px 15px 10px 15px;
  box-shadow:
    inset 0 8px 0 rgba(255, 255, 255, 0.15),
    inset 8px 0 0 rgba(255, 255, 255, 0.1),
    inset -8px 0 0 rgba(0, 0, 0, 0.15);
}

.gm-screen {
  background-color: #1a1618;
  border: 4px solid #000;
  border-radius: 8px;
  padding: 15px 10px 10px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: inset 0 6px 10px rgba(0, 0, 0, 0.8);
}

.gm-counter {
  display: flex;
  gap: 8px;
  margin-bottom: 15px;
}

/* Кожен елемент слота (наприклад, .countdown) оформлюється як плашка-барабан */
.gm-counter > :slotted(*) {
  background-color: #e3d5c5;
  border: 4px solid #000;
  width: 40px;
  height: 50px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'VT323', monospace;
  font-size: 40px;
  line-height: 1;
  color: #312a25;
  border-radius: 4px;
  box-shadow:
    inset 0 6px 0 rgba(0, 0, 0, 0.1),
    inset 0 -6px 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.gm-coin-area {
  background-color: #7d573e;
  border: 4px solid #000;
  border-radius: 6px;
  width: 80px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: -5px;
}

.gm-coin-slot {
  background-color: #f7ca38;
  border: 3px solid #000;
  width: 30px;
  height: 8px;
  border-radius: 2px;
  box-shadow: inset 0 -2px 0 rgba(180, 110, 20, 0.8);
}

.gm-base {
  background-color: #554e53;
  border: 4px solid #000;
  border-radius: 0 0 12px 12px;
  height: 70px;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  box-shadow:
    inset 0 -8px 0 rgba(0, 0, 0, 0.3),
    inset 8px 0 0 rgba(255, 255, 255, 0.05),
    inset -8px 0 0 rgba(0, 0, 0, 0.15);
}

.gm-base-detail {
  width: 60%;
  height: 20px;
  border: 4px solid #3c3539;
  border-bottom: none;
  border-radius: 4px 4px 0 0;
  opacity: 0.5;
}
</style>
