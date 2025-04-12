from flask import Flask, render_template, request, jsonify
import secrets

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/play', methods=['POST'])
def play_coinflip():
    bet = request.json.get('bet', 0)
    if bet <= 0:
        return jsonify({'error': 'Invalid bet amount!'}), 400

    # Randomly assign "heads" or "tails"
    user_choice = secrets.choice(["heads", "tails"])
    flip_result = secrets.choice(["heads", "tails"])

    result = {
        "user_choice": user_choice,
        "flip_result": flip_result,
        "won": user_choice == flip_result
    }
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
