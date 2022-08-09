import React, { Component } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Dropdown } from "react-bootstrap";
import { useRouter } from "next/router";

import styles from "../styles/feed.module.css";

import { server } from "../config";
import { changeDataUser } from "../redux/feed-user-slice";
import { hideLoading, showLoading } from "../redux/loading-slice";
import { setHasMore } from "../redux/has-more-slice";
import ApplyButton from "./ApplyButton";
import { feedLimit } from "../constants/constants";

const FilterFeedButton = (props) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state) => state.dataUser.value);
  // const feeds = useSelector((state) => state.dataFeed.value);
  // console.log("FilterFeedButton render user=", user);
  const filters = [
    { val: "0", name: "Todas", id: "filter0", data: "filter0" },
    { val: "1", name: "Lidas", id: "filter1", data: "filter1" },
    { val: "2", name: "Não Lidas", id: "filter2", data: "filter2" },
    { val: "3", name: "Favoritas", id: "filter3", data: "filter3" },
  ];

  function toogleRadio(el) {
    console.log("toogleRadio", el.target.dataset.value, user.filter, el);
    // dispatch(changeDataUser(["filterOpen", true]));
    dispatch(
      changeDataUser([
        "filter",
        el.target.dataset.value ? el.target.dataset.value : "0",
      ])
    );
    // console.log("toogleRadio depois", el.target.dataset.value, user.filter);
    // el.stopPropagation();
    // el.nativeEvent.stopImmediatePropagation();
  }

  const onToggle = (a, el) => {
    // console.log();
    // console.log("onToggle", a, el.originalEvent.target, user.filterOpen);
    // console.log();
    // if (el.originalEvent)
    //   if (el.originalEvent.target)
    //     if (el.originalEvent.target.type)
    //       if (el.originalEvent.target.type === "submit") {
    //         console.log("=====================================");
    //         return;
    //       }
    dispatch(changeDataUser(["filterOpen", !user.filterOpen]));
    dispatch(changeDataUser(["filterIdolOpen", false]));
    dispatch(changeDataUser(["timeFilterOpen", false]));
  };

  const addIdolAction = () => {
    dispatch(setLastView(viewFeedState));
    // console.log("viewFeedState", viewFeedState);
    dispatch(viewAddIdol());
    // console.log("viewFeedState", viewFeedState);
  };

  const filter = (el) => {
    el.preventDefault();
    dispatch(changeDataUser(["filterOpen", false]));
    const newValue = user.filter ? user.filter : "0";
    if (newValue === user.filterApplied) {
      // console.log("there were no changes ====================================");
      return;
    }
    // show loading message / spinning
    dispatch(showLoading());
    dispatch(changeDataUser(["filterApplied", newValue]));

    // show loading message / spinning
    dispatch(showLoading());

    const filterText = "";
    switch (user.filter) {
      case "0":
        filterText = "Mostrando todas";
        break;
      case "1":
        filterText = "Mostrando apenas lidas";
        break;
      case "2":
        filterText = "Mostrando apenas não lidas";
        break;
      case "3":
        filterText = "Mostrando apenas favoritas";
        break;
    }
    dispatch(changeDataUser(["filterText", filterText]));

    fetch(`${server}/feeds/filter/`, {
      method: "POST",
      body: JSON.stringify({ filter: newValue }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((json) => {
        dispatch(hideLoading());
        // console.log("===============saving filter    ", json);
        if (json.error === -1) {
          // houver erro - logout or timeout - need to login
          router.push("/login?timeout=true");
          return;
        }
        props.filterAction(json.list);
        if (json.list < feedLimit) dispatch(setHasMore(false));
        else dispatch(setHasMore(true));
      });
  };

  function loadFilter(e) {
    // console.log(
    //   "===============  loadFilter",
    //   user.filterOpen,
    //   user.filterApplied,
    //   user.filter
    // );
    // load the filter back only if the dropdown is closed --> when user click the button to open it and change the filter
    if (user.filterOpen) return;
    dispatch(changeDataUser(["filter", user.filterApplied]));
  }

  return (
    <>
      <div className="text-center">
        <Dropdown
          show={user.filterOpen}
          onToggle={onToggle}
          autoClose="outside"
          onClick={loadFilter}
        >
          <Dropdown.Toggle
            variant="warning"
            id="dropdown-basic"
            className="blue fw-bold"
          >
            Filtrar Notícias
          </Dropdown.Toggle>

          <Dropdown.Menu className={styles.dropdownMenu}>
            {filters.map((e) => (
              <Dropdown.Item
                onClick={toogleRadio}
                key={e.val}
                data-value={e.val}
              >
                <div className="form-check" data-value={e.val}>
                  <input
                   id={"filterFeed" + e.val}
                    className="form-check-input form-check-input-sm"
                    type="radio"
                    name="filter"
                    data-value={e.val}
                    checked={user.filter === e.val}
                    onChange={toogleRadio}
                  />
                  <label for={"filterFeed" + e.val} className="form-check-label" data-value={e.val}>
                    {e.name}
                  </label>
                </div>
              </Dropdown.Item>
            ))}
            <Dropdown.Item>
              <ApplyButton action={filter} />
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        {user.filter === "0" ? (
          <p>{user.filterText}</p>
        ) : (
          <p className="red">{user.filterText}</p>
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

export default FilterFeedButton;
