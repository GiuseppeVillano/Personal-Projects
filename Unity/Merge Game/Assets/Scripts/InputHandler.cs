using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.UI;

public class InputHandler : MonoBehaviour, IBeginDragHandler, IEndDragHandler, IDragHandler {
    public Canvas canvas;
    private RectTransform itemRT;
    public GridElement grid;
    public string nameElem="";
    public int levelElem=-1;

    public void OnBeginDrag(PointerEventData eventData) {
        if (levelElem == -1) {
            return;
        }
        itemRT = gameObject.transform.GetChild(0).GetComponent<RectTransform>();
        itemRT.SetParent(canvas.transform);
    }
    public void OnDrag(PointerEventData eventData) {
        try {
            itemRT.position = Input.mousePosition;
        }
        catch{ }
    }
    public void OnEndDrag(PointerEventData eventData) {
        if (levelElem == -1) {
            return;
        }
        Vector3 objectPos = itemRT.transform.position;
        float width = itemRT.rect.width;
        Collider2D[] colliders = Physics2D.OverlapBoxAll(objectPos, new Vector2(width, width), 0f);
        Collider2D nearestCollider = null;
        if (colliders.Length > 0) {
            float minDistance = float.MaxValue;
            foreach (Collider2D col in colliders) {
                float distance = Vector2.Distance(objectPos, col.transform.position);
                if (distance < minDistance && col.name.Contains("Slot")) {
                    minDistance = distance;
                    nearestCollider = col;
                }
            }
        }
        if (nearestCollider != null) {
            itemRT.position = nearestCollider.transform.position;
            itemRT.SetParent(nearestCollider.transform);
            Image childNearestCollider = nearestCollider.transform.GetChild(0).GetComponent<Image>();
            Image img = itemRT.GetComponent<Image>();
            InputHandler nearestElem = nearestCollider.GetComponent<InputHandler>();
            int index = grid.nameElements.IndexOf(nameElem);
            //Empty
            if (childNearestCollider.color.a == 0) {
                childNearestCollider.sprite = img.sprite;
                childNearestCollider.color = SetAlpha(img, 1);
                img.color = SetAlpha(img, 0);
                SwapNames(ref nameElem, ref nearestElem.nameElem);
                SwapLevels(ref levelElem, ref nearestElem.levelElem);
            }
            //Full and not Same slot
            else if(transform.GetSiblingIndex() != nearestCollider.transform.GetSiblingIndex()) {
                //same name
                if (nameElem == nearestElem.nameElem) {
                    //different level -> swap
                    if (levelElem != nearestElem.levelElem) {
                        print("swap");
                        SwapSprites(ref img, ref childNearestCollider);
                        SwapNames(ref nameElem, ref nearestElem.nameElem);
                        SwapLevels(ref levelElem, ref nearestElem.levelElem);
                    }
                    //same level but not equal to max
                    else if (levelElem == nearestElem.levelElem && nearestElem.levelElem != grid.elements[index].elemSprite.Count-1) {
                        print("merge");
                        childNearestCollider.sprite = grid.elements[index].elemSprite[++nearestElem.levelElem];
                        img.color = SetAlpha(img, 0);
                        nameElem = "";
                        levelElem = -1;
                        grid.AddToTotalCoins(nearestElem.levelElem * 10);
                    }
                    //both max elem same type
                    else {
                        print("Got max level.");
                    }

                }
                //different name -> swap
                else {
                    SwapSprites(ref img, ref childNearestCollider);
                    SwapNames(ref nameElem, ref nearestElem.nameElem);
                    SwapLevels(ref levelElem, ref nearestElem.levelElem);
                }
            }
        }
        BackToTheParent();
    }
    Color SetAlpha(Image i, int a) {
        return new Color(i.color.r, i.color.b, i.color.g, a);
    }
    void SwapSprites(ref Image img1, ref Image img2) {
        Sprite tmp = img1.sprite;
        img1.sprite = img2.sprite;
        img2.sprite = tmp;
    }
    void SwapNames(ref string n1,ref string n2) {
        string tmpName = n1;
        n1 = n2;
        n2 = tmpName;
    }
    void SwapLevels(ref int n1, ref int n2) {
        int tmpName = n1;
        n1 = n2;
        n2 = tmpName;
    }
    void BackToTheParent() {
        itemRT.position = transform.position;
        itemRT.SetParent(transform);
    }
    public void SetInfoElement(string n, int l) {
        nameElem = n;
        levelElem = l;
        
    }
    public int GetLevel() {
        return levelElem;
    }
}
