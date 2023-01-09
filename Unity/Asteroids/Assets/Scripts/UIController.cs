using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.UI;
using TMPro;
using System.Collections;

public class UIController : MonoBehaviour {
    public static UIController Instance { get; private set; }

    [SerializeField]
    private Image[] LifePoints;
    [SerializeField]
    private TextMeshProUGUI ScoreText;

    void Awake() {
        if (Instance == null) {
            Instance = this;
            return;
        }
        Destroy(gameObject);
    }

    public void SetScoreText(int score) {
        ScoreText.text = score.ToString().PadLeft(4, '0');
    }

    public void SetLifePoints(int lifePoints) {
        for (int i = 0; i < LifePoints.Length; i++) {
            LifePoints[i].enabled = i < lifePoints;
        }
    }

    public void ChangeScene(string scene) {
        SceneManager.LoadScene(scene);
    }

    public bool IsThisScene(string scene) {
        return SceneManager.GetActiveScene().name.Equals(scene);
    }
}