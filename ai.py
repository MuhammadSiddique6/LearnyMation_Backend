import joblib
from sklearn.tree import DecisionTreeClassifier

# Subjects list in order
subjects = ["Math", "Science", "Logic Thinking", "Creativity", "Object Detection"]

# Your dataset: Each list is scores in the order of subjects above
data = [
    [5, 5, 2, 1, 2],
    [4, 4, 3, 2, 2],
    [5, 4, 2, 2, 3],
    [4, 5, 1, 2, 3],

    [3, 2, 3, 3, 5],
    [3, 2, 3, 3, 5],
    [1, 1, 2, 4, 5],
    [2, 1, 2, 3, 5],
    [3, 2, 3, 3, 5],
    [3, 3, 2, 3, 5],

    [3, 2, 5, 1, 2],
    [2, 1, 5, 2, 1],
    [1, 2, 5, 1, 2],
    [1, 1, 5, 1, 1],

    [5, 1, 1, 1, 1],
    [4, 1, 2, 2, 1],
    [5, 2, 1, 1, 2],
    [5, 1, 1, 2, 1],

    [1, 5, 1, 1, 1],
    [2, 5, 1, 1, 1],
    [1, 4, 1, 2, 1],

    [1, 1, 1, 5, 1],
    [2, 2, 2, 5, 1],
    [1, 1, 1, 4, 2],
]

def label_row(scores):
    # Find subjects with score >= 4
    strong_subjects = [(subjects[i], score) for i, score in enumerate(scores) if score >= 4]
    if strong_subjects:
        # Sort by score descending, take top subject
        strong_subjects.sort(key=lambda x: x[1], reverse=True)
        return strong_subjects[0][0]
    else:
        return "Needs Improvement"

# Create labels based on scores
X = data
y = [label_row(scores) for scores in data]

print("Labels for training:")
for scores, label in zip(X, y):
    print(f"{scores} -> {label}")

# Train Decision Tree classifier
model = DecisionTreeClassifier()
model.fit(X, y)

# Save the trained model
joblib.dump(model, 'field_recommendation_model.joblib')

print("\nModel trained and saved as 'field_recommendation_model.joblib'")
