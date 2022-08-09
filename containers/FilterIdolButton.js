import React, { Component } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { Dropdown } from "react-bootstrap";
import styles from "../styles/feed.module.css";

import { server } from "../config";
import { changeDataUser, changeIdolList } from "../redux/feed-user-slice";
import { setDataFeed } from "../redux/feed-data-slice";
import { setHasMore } from "../redux/has-more-slice";
import ApplyButton from "./ApplyButton";
import { hideLoading, showLoading } from "../redux/loading-slice";
import { feedLimit } from "../constants/constants";

const FilterIdolButton = (props) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state) => state.dataUser.value);
  // console.log("FilterIdolButton render user=", user);

  function toggleCheckBox(el) {
    // console.log(" toggleCheckBox", el.target.dataset.value, el.target);
    const idx = parseInt(el.target.dataset.value);
    const newValue = user.idolList[idx].checked === "1" ? "0" : "1";
    dispatch(
      changeIdolList([
        idx,
        "checked",
        user.idolList[idx].checked === "1" ? "0" : "1",
      ])
    );

    if (idx === 0 && newValue === "1") {
      // all is checked, uncheck others
      // checked ALL  -- uncheck all idols names
      for (var i = 1; i < user.idolList.length; i++) {
        dispatch(changeIdolList([i, "checked", "0"]));
      }
    }
    if (idx != 0 && user.idolList[0].checked === "1") {
      // checked one idol name, uncheck ALL
      dispatch(changeIdolList([0, "checked", "0"]));
    }
  }

  const onToggle = (a, el) => {
    // console.log();
    // console.log("onToggle", a, el.originalEvent.target, user.filterIdolOpen);
    // console.log();
    dispatch(changeDataUser(["filterIdolOpen", !user.filterIdolOpen]));
    dispatch(changeDataUser(["timeFilterOpen", false]));
    dispatch(changeDataUser(["filterOpen", false]));
  };

  const saveFilter = (el) => {
    el.preventDefault();
    // is there any idol checked?
    var thereIsCheckedIdol = false;
    for (const idol of user.idolList) {
      if (idol.checked === "1") thereIsCheckedIdol = true;
    }
    if (!thereIsCheckedIdol) {
      alert("Por favor selecione pelo menos um ídolo!!");
      return;
    }

    // was there any change? return if not
    var thereIsChange = false;
    for (var i = 0; i < user.idolList.length; i++) {
      if (user.idolList[i].checked !== user.idolList[i].checkedApplied)
        thereIsChange = true;
    }
    dispatch(changeDataUser(["filterIdolOpen", false]));
    if (!thereIsChange) {
      // console.log("there were no changes ====================================");
      return;
    }
    // show loading message / spinning
    dispatch(showLoading());

    // update states
    // const newValue = user.filterIdol ? user.filterIdol : "0";
    // console.log("filter newValue=", newValue);
    for (var i = 0; i < user.idolList.length; i++) {
      dispatch(changeIdolList([i, "checkedApplied", user.idolList[i].checked]));
    }

    // set filter IDOL text  =======================================
    const filterIdolText = "";
    if (user.idolList[0].checked === "1")
      filterIdolText = "Mostrando todos seus ídolos";
    else {
      filterIdolText = "Mostrando: ";
      var comma = "";
      // set checked filed for each idol
      for (var i = 1; i < user.idolList.length; i++) {
        if (user.idolList[i].checked === "1") {
          filterIdolText += comma + user.idolList[i].name;
          comma = ", ";
        }
      }
    }
    dispatch(changeDataUser(["filterIdolText", filterIdolText]));

    // set filter Idol for the server
    var filterIdol = [];
    for (const idol of user.idolList) {
      if (idol.checked === "1") filterIdol.push(idol.id);
    }

    fetch(`${server}/feeds/filterIdol/`, {
      method: "POST",
      body: JSON.stringify({ filter: filterIdol.toString() }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((json) => {
        dispatch(hideLoading());
        // console.log('===============saveFilter ', json)
        if (json.error === -1) {
          // houver erro - logout or timeout - need to login
          router.push("/login?timeout=true");
          return;
        }
        dispatch(setDataFeed(json.list));
        if (json.list < feedLimit) dispatch(setHasMore(false));
        else dispatch(setHasMore(true));
      });
  };

  function loadFilter(e) {
    // console.log("=============== loadFilter user=", user);
    // load the filter back only if the dropdown is closed --> when user click the button to open it and change the filter
    if (user.filterIdolOpen) return;
    for (var i = 0; i < user.idolList.length; i++) {
      dispatch(changeIdolList([i, "checked", user.idolList[i].checkedApplied]));
    }
  }

  return (
    <>
      <div className="text-center">
        <Dropdown
          show={user.filterIdolOpen}
          onToggle={onToggle}
          autoClose="outside"
          onClick={loadFilter}
        >
          <Dropdown.Toggle
            variant="warning"
            id="dropdown-basic"
            className="blue fw-bold"
          >
            Filtrar Ídolos
          </Dropdown.Toggle>

          <Dropdown.Menu className={styles.dropdownMenu}>
            {user.idolList &&
              user.idolList.map((e, idx) => (
                <Dropdown.Item
                  onClick={toggleCheckBox}
                  data-value={idx}
                  key={idx}
                >
                  <div className="form-check" data-value={idx}>
                    {/* {console.log({e.id})} */}
                    <input
                      id={"fielterIdol" + e.id}
                      className="form-check-input form-check-input-sm"
                      type="checkbox"
                      data-value={idx}
                      checked={e.checked === "1"}
                      onChange={toggleCheckBox}
                    />
                    <label
                      for={"fielterIdol" + e.id}
                      className="form-check-label"
                      data-value={idx}
                    >
                      {e.name}
                    </label>
                  </div>
                </Dropdown.Item>
              ))}
            <Dropdown.Item>
              <ApplyButton action={saveFilter} />
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        {user && user.idolList && user.idolList[0].checked === "1" ? (
          <p>{user.filterIdolText}</p>
        ) : (
          <p className="red">{user.filterIdolText}</p>
        )}
      </div>
      <style jsx>{`
        .dropdown-menu {
          background-color: black;
        }
      `}</style>
    </>
  );
};

export default FilterIdolButton;
