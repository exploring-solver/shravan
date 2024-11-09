import tkinter as tk
import random
import time

class GuessTheNumberGame:
    def __init__(self, root):
        self.root = root
        self.root.title("Guess the Number!")
        self.root.geometry("400x300")
        
        self.secret_number = random.randint(1, 100)
        self.attempts = 0
        self.create_widgets()

    def create_widgets(self):
        self.label = tk.Label(self.root, text="I'm thinking of a number between 1 and 100...", font=("Arial", 12))
        self.label.pack(pady=10)

        self.entry = tk.Entry(self.root, font=("Arial", 14), justify="center")
        self.entry.pack(pady=5)
        self.entry.focus()

        self.result_label = tk.Label(self.root, text="", font=("Arial", 10))
        self.result_label.pack(pady=10)

        self.guess_button = tk.Button(self.root, text="Guess", command=self.check_guess)
        self.guess_button.pack(pady=10)

        self.reset_button = tk.Button(self.root, text="Play Again", command=self.reset_game)
        self.reset_button.pack(pady=10)
        self.reset_button.config(state="disabled")

    def check_guess(self):
        try:
            guess = int(self.entry.get())
            self.attempts += 1
            self.result_label.config(fg="black")

            if guess < self.secret_number:
                self.animate_message("Higher... but try again!", "blue")
            elif guess > self.secret_number:
                self.animate_message("Lower... but try again!", "purple")
            else:
                self.animate_message(f"You got it in {self.attempts} attempts!", "green")
                self.end_game()

        except ValueError:
            self.result_label.config(text="Enter a valid number!", fg="red")

    def animate_message(self, message, color):
        # Animating the message to appear letter-by-letter
        self.result_label.config(text="", fg=color)
        for i in range(len(message)):
            self.result_label.config(text=message[:i + 1])
            self.root.update_idletasks()
            time.sleep(0.05)

    def end_game(self):
        self.guess_button.config(state="disabled")
        self.reset_button.config(state="normal")

    def reset_game(self):
        self.secret_number = random.randint(1, 100)
        self.attempts = 0
        self.entry.delete(0, tk.END)
        self.result_label.config(text="")
        self.guess_button.config(state="normal")
        self.reset_button.config(state="disabled")

def run_game():
    root = tk.Tk()
    game = GuessTheNumberGame(root)
    root.mainloop()

if __name__ == "__main__":
    run_game()
