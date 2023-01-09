using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class Game : MonoBehaviour {
    public Camera MainCam;
    public GameObject[] enemies;
    private Button b;
    private TMPro.TextMeshProUGUI hs;
    //Score
    private static int maxScore = 0;

    //Sign name values
    private static string nameLead = "";
    private int count = 0;
    string tmp = "___";
    private string letters = "_abcdefghijklmnopqrstuvwxyz";
    private int index = 0;


    private float TopBoundary;
    private float RightBoundary;
    private float BottomBoundary;
    private float LeftBoundary;


    

    void StartGame() {
        UIController.Instance.ChangeScene("Game");
    }

    public void ResetAll(int score) {
        if (maxScore < score) {
            maxScore = score;
            StartCoroutine(GameOver());
        }
        else {
            UIController.Instance.ChangeScene("Start");
        }
    }

    void CacheCameraBoundaries() {
        if (MainCam != null) {
            TopBoundary = MainCam.ViewportToWorldPoint(new Vector3(0.5f, 1f, 0)).y;
            RightBoundary = MainCam.ViewportToWorldPoint(new Vector3(1, 0.5f, 0)).x;
            BottomBoundary = MainCam.ViewportToWorldPoint(new Vector3(0.5f, 0f, 0)).y;
            LeftBoundary = MainCam.ViewportToWorldPoint(new Vector3(0, 0.5f, 0)).x;
        }
    }

    void Start() {
        CacheCameraBoundaries();

        //Start
        if (UIController.Instance.IsThisScene("Start")) {
            b = GameObject.Find("Start").GetComponent<Button>();
            b.GetComponent<Button>().onClick.AddListener(StartGame);
            hs = GameObject.Find("MaxScore").GetComponent<TMPro.TextMeshProUGUI>();
            string s = maxScore + "";
            s = s.PadLeft(4, '0');
            hs.text = "Highest Score \n" + s + " " + nameLead;
        }
        //Game
        if (UIController.Instance.IsThisScene("Game")) {
            foreach (GameObject e in enemies) {
                e.SetActive(false);
            }
            StartCoroutine(GenerateEnemies());
        }
        //Record
        if (UIController.Instance.IsThisScene("Record")) {
            StartCoroutine(SignRecord());
        }
    }

    private void Update() {
        if (UIController.Instance.IsThisScene("Record")) {
            if (Input.GetKeyDown(KeyCode.Space)) {
                if (count < 3) {
                    tmp = tmp.Remove(count, 1).Insert(count, letters[index] + "");
                    count++;
                    index = 0;
                }
            }
            else if (Input.GetKeyDown(KeyCode.W)) {
                index = (index + 1) % letters.Length;
                if (index == 0) {
                    index++;
                }
            }
            else if (Input.GetKeyDown(KeyCode.S)) {
                index--;
                if (index <= 0) {
                    index = letters.Length - 1;
                }
            }
        }
    }

    IEnumerator SignRecord() {
        TMPro.TextMeshProUGUI nameTxt = GameObject.Find("Name").GetComponent<TMPro.TextMeshProUGUI>();
        bool b = true;
        while (count < 3) {
            tmp = b ? tmp.Remove(count, 1).Insert(count, " ") : tmp.Remove(count, 1).Insert(count, letters[index] + "");
            b = !b;
            nameTxt.text = tmp;
            yield return new WaitForSeconds(0.5f);
        }
        nameLead = tmp;
        UIController.Instance.ChangeScene("Start");
    }

    IEnumerator GameOver() {
        TMPro.TextMeshProUGUI gameOver = GameObject.Find("GameOver").GetComponent<TMPro.TextMeshProUGUI>();
        Color addOpacity = gameOver.color;
        addOpacity.a = 1f;
        gameOver.color = addOpacity;
        
        float t = 0;
        while (t < 2f) {
            t += Time.deltaTime;
            yield return null;
        }
        UIController.Instance.ChangeScene("Start");
    }

    IEnumerator GenerateEnemies() {
        float t = 0f;
        //create an enemy until player exists
        while (GameObject.Find("Player") != null) {
            object b= Mathf.RoundToInt(Random.Range(0, 10)) < 7 ? CreateEnemy(enemies[0]) : CreateEnemy(enemies[1]);

            t = 0f;
            while (t < 9f) {
                t += Time.deltaTime;
                yield return null;
            }
            yield return null;
        }
        //Game Over delete everything
        foreach (GameObject g in Resources.FindObjectsOfTypeAll(typeof(GameObject)) as GameObject[]) {
            if (g.name.Contains("(Clone)") && g.activeSelf) {
                Destroy(g);
            }
        }
    }

    object CreateEnemy(GameObject enemy) {
        GameObject player = GameObject.Find("Player");
        float offsetX = 0;
        float offsetY = 0;
        float topOrBottom = 0;
        float leftOrRight = 0;

        object offsetDist = RandomBit()==0 ? offsetX = Random.Range(-3, 3) : offsetY = Random.Range(-6, 6);
        object directionTB = RandomBit() == 0 ? topOrBottom = TopBoundary : topOrBottom = BottomBoundary;
        object directionLR = RandomBit() == 0 ? leftOrRight = LeftBoundary : leftOrRight = RightBoundary;

        Vector3 pos = new Vector3(leftOrRight + offsetX, topOrBottom + offsetY, 0);
        GameObject e = Instantiate(enemy, pos, Quaternion.identity);
        e.SetActive(true);
        return null;
    }

    int RandomBit() {
        return Mathf.RoundToInt(Random.Range(0, 2));
    }

    private void OnTriggerExit2D(Collider2D collision) {
        if (!collision.gameObject.name.Contains("Bullet")) {
            Teleport(collision.gameObject);
        }
    }

    public void DestroyIfOff(GameObject g) {
        float x = g.transform.position.x;
        float y = g.transform.position.y;
       
        if (x < LeftBoundary) {
            Destroy(g);
            return;
        }
        else if (x > RightBoundary) {
            Destroy(g);
            return;
        }
        if (y > TopBoundary) {
            Destroy(g);
            return;
        }
        else if (y < BottomBoundary) {
            Destroy(g);
        }
    }

    public void Teleport(GameObject g) {
        Transform objT = g.transform;
        Vector2 objP = objT.position;

        float x = objP.x;
        float y = objP.y;
        float offset = 0.3f;

        if (x < LeftBoundary) {
            x = RightBoundary + offset;
        }
        else if (x > RightBoundary) {
            x = LeftBoundary - offset;
        }
        if (y > TopBoundary) {
            y = BottomBoundary - offset;
        }
        else if (y < BottomBoundary) {
            y = TopBoundary + offset;
        }

        if (x != objP.x || y != objP.y) {
            objP.x = x;
            objP.y = y;
            objT.position = objP;
        }
    }
}
