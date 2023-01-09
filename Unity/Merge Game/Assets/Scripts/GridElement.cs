using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.UI;

public class GridElement : MonoBehaviour {

    [Header("Currency")]
    public MoneyCounter moneyCounterScript;
    public int totalCoins = 0;

    [Header("Grid Components")]
    public RectTransform gridObj;
    public GameObject slot;
    public List<string> nameElements;
    public List<Element> elements;
    public List<List<int>> grid = new List<List<int>>(8);

    private List<List<GameObject>> slots = new List<List<GameObject>>(8);

    void Start() {
        InitGrid();
    }
    void InitGrid() {
        int count = 0;
        float size = slot.GetComponent<RectTransform>().rect.width, space = 5f;
        for (int i = 0; i < 4; i++) {
            grid.Add(new List<int>(4));
            slots.Add(new List<GameObject>(4));
            for (int j = 0; j < 4; j++) {
                //empty
                grid[i].Add(-1);
                //in game slots
                slots[i].Add(Instantiate(slot, new Vector2(40 + (size * j) + (space * j), 400 - (size * i) - (space * i)), Quaternion.identity));
                slots[i][j].transform.SetParent(gridObj);
                if (count < 4) {
                    Sprite sprite = elements[0].elemSprite[count % 2];
                    Image img = slots[i][j].transform.GetChild(0).transform.GetComponent<Image>();
                    slots[i][j].GetComponent<InputHandler>().SetInfoElement(nameElements[0], count % 2);
                    img.sprite = sprite;
                    img.color = new Color(img.color.r, img.color.b, img.color.g, 1);
                    count++;
                }
                slots[i][j].SetActive(true);
            }
        }
        Destroy(slot);
    }

    public void SpawnItem() {
        for (int i = 0; i < 4; i++) {
            for (int j = 0; j < 4; j++) {
                //slot empty,add to the list
                if (slots[i][j].GetComponent<InputHandler>().levelElem==-1) {
                    int randomElement = Random.Range(0, nameElements.Count);
                    int randomLevel = Random.Range(0, elements[randomElement].elemSprite.Count);
                    Sprite sprite = elements[randomElement].elemSprite[randomLevel];
                    Image img = slots[i][j].transform.GetChild(0).transform.GetComponent<Image>();
                    slots[i][j].GetComponent<InputHandler>().SetInfoElement(nameElements[randomElement], randomLevel);
                    img.sprite = sprite;
                    img.color = new Color(img.color.r, img.color.b, img.color.g, 1);
                    return;
                }
            }
        }
    }

    public void AddToTotalCoins(int amount) {
        totalCoins += amount;
        moneyCounterScript.UpdateCoinsAmount(totalCoins);
    }
}
